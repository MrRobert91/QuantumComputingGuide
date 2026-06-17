"""Best-effort sandbox for executing user-submitted Qiskit code.

This is a *learning tool* safeguard, not a guarantee against a determined attacker.
It combines:
  1. AST validation - reject imports/names/attributes outside a small allowlist.
  2. A subprocess with a hard wall-clock timeout and (on POSIX) CPU/memory rlimits.

The executed snippet must define a circuit named ``qc`` (preferred) or ``circuit``.
The subprocess serializes that circuit to OpenQASM 3 and prints it to stdout, so the
parent process never unpickles arbitrary objects.
"""
from __future__ import annotations

import ast
import json
import subprocess
import sys
import textwrap

from app.core.config import get_settings

# Modules the snippet is allowed to import.
_ALLOWED_IMPORTS = {"qiskit", "numpy", "np", "math", "cmath"}

# Attribute access / names that are never allowed.
_FORBIDDEN_NAMES = {
    "eval", "exec", "compile", "open", "input", "__import__", "globals", "locals",
    "vars", "getattr", "setattr", "delattr", "exit", "quit", "help", "memoryview",
    "breakpoint",
}


class SandboxError(Exception):
    """Raised when code is rejected or fails to execute safely."""


def validate_ast(code: str) -> None:
    """Reject code that imports/accesses anything outside the allowlist."""
    try:
        tree = ast.parse(code)
    except SyntaxError as exc:  # noqa: TRY003
        raise SandboxError(f"Syntax error: {exc.msg} (line {exc.lineno})") from exc

    for node in ast.walk(tree):
        if isinstance(node, ast.Import):
            for alias in node.names:
                root = alias.name.split(".")[0]
                if root not in _ALLOWED_IMPORTS:
                    raise SandboxError(f"Import of '{alias.name}' is not allowed")
        elif isinstance(node, ast.ImportFrom):
            root = (node.module or "").split(".")[0]
            if root not in _ALLOWED_IMPORTS:
                raise SandboxError(f"Import from '{node.module}' is not allowed")
        elif isinstance(node, ast.Name):
            if node.id in _FORBIDDEN_NAMES:
                raise SandboxError(f"Use of '{node.id}' is not allowed")
        elif isinstance(node, ast.Attribute):
            # Block dunder/attribute escapes like obj.__class__.__bases__...
            if node.attr.startswith("__") and node.attr.endswith("__"):
                raise SandboxError(f"Access to dunder attribute '{node.attr}' is not allowed")


# Runner template executed inside the subprocess. It rebuilds the circuit, locates
# `qc`/`circuit`, and emits QASM3 so the parent stays isolated from live objects.
_RUNNER = """
import json, sys
import numpy as np  # noqa: F401 (available to user code)

USER_CODE = json.loads(sys.stdin.read())

ns = {}
try:
    exec(USER_CODE, ns)
except Exception as exc:  # noqa: BLE001
    print(json.dumps({"error": f"{type(exc).__name__}: {exc}"}))
    sys.exit(0)

circuit = ns.get("qc") or ns.get("circuit")
if circuit is None:
    print(json.dumps({"error": "Your code must define a circuit named 'qc' or 'circuit'."}))
    sys.exit(0)

from qiskit import QuantumCircuit  # noqa: E402
if not isinstance(circuit, QuantumCircuit):
    print(json.dumps({"error": "'qc' must be a QuantumCircuit instance."}))
    sys.exit(0)

from qiskit.qasm3 import dumps  # noqa: E402
print(json.dumps({"qasm3": dumps(circuit)}))
"""


def _apply_limits() -> None:  # pragma: no cover - POSIX-only, exercised in container
    """preexec_fn: cap CPU time and address space for the child process."""
    try:
        import resource

        settings = get_settings()
        cpu = max(1, settings.sandbox_timeout_seconds)
        resource.setrlimit(resource.RLIMIT_CPU, (cpu, cpu))
        mem = settings.sandbox_max_memory_mb * 1024 * 1024
        resource.setrlimit(resource.RLIMIT_AS, (mem, mem))
    except Exception:
        pass


def run_user_code_to_qasm(code: str) -> str:
    """Validate, execute the snippet in a subprocess, and return its circuit as QASM3."""
    validate_ast(code)
    settings = get_settings()

    runner = textwrap.dedent(_RUNNER)
    preexec = _apply_limits if sys.platform != "win32" else None
    try:
        proc = subprocess.run(
            [sys.executable, "-c", runner],
            input=json.dumps(code),
            capture_output=True,
            text=True,
            timeout=settings.sandbox_timeout_seconds,
            preexec_fn=preexec,
        )
    except subprocess.TimeoutExpired as exc:
        raise SandboxError(
            f"Execution timed out after {settings.sandbox_timeout_seconds}s"
        ) from exc

    if proc.returncode != 0:
        raise SandboxError(proc.stderr.strip() or "Execution failed")

    try:
        payload = json.loads(proc.stdout.strip().splitlines()[-1])
    except (json.JSONDecodeError, IndexError) as exc:
        raise SandboxError("Could not read execution result") from exc

    if "error" in payload:
        raise SandboxError(payload["error"])
    return payload["qasm3"]

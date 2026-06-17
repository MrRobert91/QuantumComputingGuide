import pytest

from app.services.sandbox import SandboxError, run_user_code_to_qasm, validate_ast


def test_allows_qiskit_code():
    code = "from qiskit import QuantumCircuit\nqc = QuantumCircuit(1)\nqc.h(0)\n"
    qasm = run_user_code_to_qasm(code)
    assert "OPENQASM 3" in qasm


def test_blocks_os_import():
    with pytest.raises(SandboxError):
        validate_ast("import os\nos.system('echo hi')")


def test_blocks_eval():
    with pytest.raises(SandboxError):
        validate_ast("x = eval('1+1')")


def test_blocks_dunder_escape():
    with pytest.raises(SandboxError):
        validate_ast("().__class__.__bases__")


def test_requires_named_circuit():
    code = "from qiskit import QuantumCircuit\nfoo = QuantumCircuit(1)\n"
    with pytest.raises(SandboxError):
        run_user_code_to_qasm(code)

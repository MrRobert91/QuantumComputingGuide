"""Circuit endpoints: execute, composer<->code conversion, transpile."""
from __future__ import annotations

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from qiskit import QuantumCircuit, transpile
from qiskit.qasm3 import loads as qasm3_loads

from app.models.circuit import (
    CodeSource,
    ComposerCircuit,
    ConversionResponse,
    ExecuteRequest,
    ExecuteResponse,
)
from app.services import circuit_model
from app.services.executor import execute_circuit
from app.services.sandbox import SandboxError, run_user_code_to_qasm

router = APIRouter(prefix="/circuits", tags=["circuits"])


def _circuit_from_code(code: str) -> QuantumCircuit:
    """Safely turn user code into a QuantumCircuit (sandbox -> QASM3 -> circuit)."""
    qasm = run_user_code_to_qasm(code)
    return qasm3_loads(qasm)


@router.post("/execute", response_model=ExecuteResponse)
def execute(req: ExecuteRequest) -> ExecuteResponse:
    try:
        if req.source_type == "code":
            if not req.code:
                raise HTTPException(400, "No code provided.")
            qc = _circuit_from_code(req.code)
            generated = circuit_model.composer_to_code(circuit_model.circuit_to_composer(qc))
        else:
            if req.composer is None:
                raise HTTPException(400, "No composer circuit provided.")
            qc = circuit_model.composer_to_circuit(req.composer)
            generated = circuit_model.composer_to_code(req.composer)
    except SandboxError as exc:
        raise HTTPException(400, str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(400, str(exc)) from exc

    try:
        resp = execute_circuit(qc, shots=req.shots, mode=req.mode)
    except ValueError as exc:
        raise HTTPException(400, str(exc)) from exc
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(500, f"Execution error: {exc}") from exc

    resp.generated_code = generated
    return resp


@router.post("/to-code", response_model=ConversionResponse)
def to_code(model: ComposerCircuit) -> ConversionResponse:
    try:
        qc = circuit_model.composer_to_circuit(model)
        code = circuit_model.composer_to_code(model)
    except ValueError as exc:
        raise HTTPException(400, str(exc)) from exc
    return ConversionResponse(code=code, diagram=qc.draw(output="text").single_string())


@router.post("/from-code", response_model=ConversionResponse)
def from_code(src: CodeSource) -> ConversionResponse:
    try:
        qc = _circuit_from_code(src.code)
    except SandboxError as exc:
        raise HTTPException(400, str(exc)) from exc
    composer = circuit_model.circuit_to_composer(qc)
    return ConversionResponse(
        composer=composer,
        code=circuit_model.composer_to_code(composer),
        diagram=qc.draw(output="text").single_string(),
    )


class TranspileRequest(BaseModel):
    composer: ComposerCircuit | None = None
    code: str | None = None
    optimization_level: int = 1
    basis_gates: list[str] = ["cx", "id", "rz", "sx", "x"]


class TranspileResponse(BaseModel):
    depth: int
    size: int
    gate_counts: dict[str, int]
    diagram: str


@router.post("/transpile", response_model=TranspileResponse)
def transpile_circuit(req: TranspileRequest) -> TranspileResponse:
    try:
        if req.code:
            qc = _circuit_from_code(req.code)
        elif req.composer is not None:
            qc = circuit_model.composer_to_circuit(req.composer)
        else:
            raise HTTPException(400, "Provide either composer or code.")
        level = max(0, min(3, req.optimization_level))
        tqc = transpile(qc, basis_gates=req.basis_gates, optimization_level=level)
    except SandboxError as exc:
        raise HTTPException(400, str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(400, str(exc)) from exc

    return TranspileResponse(
        depth=tqc.depth(),
        size=tqc.size(),
        gate_counts={k: int(v) for k, v in tqc.count_ops().items()},
        diagram=tqc.draw(output="text").single_string(),
    )

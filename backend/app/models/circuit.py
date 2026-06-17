"""Canonical circuit schema shared between the visual composer and the code editor.

The frontend composer produces a ``ComposerCircuit``; the backend converts it to a
Qiskit ``QuantumCircuit`` and back, and also generates equivalent Qiskit source code.
This single representation is what makes composer <-> code sync reliable.
"""
from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field

# Gates supported by the visual composer. Kept intentionally small and aligned
# with the certification's core gate set.
SUPPORTED_GATES = {
    # name: (num_target_qubits, num_params)
    "h": (1, 0),
    "x": (1, 0),
    "y": (1, 0),
    "z": (1, 0),
    "s": (1, 0),
    "sdg": (1, 0),
    "t": (1, 0),
    "tdg": (1, 0),
    "sx": (1, 0),
    "id": (1, 0),
    "rx": (1, 1),
    "ry": (1, 1),
    "rz": (1, 1),
    "p": (1, 1),
    "cx": (2, 0),
    "cz": (2, 0),
    "swap": (2, 0),
    "ccx": (3, 0),
    "measure": (1, 0),
}


class GateOp(BaseModel):
    """A single operation placed on the circuit."""

    name: str = Field(..., description="Gate name, e.g. 'h', 'cx', 'rx', 'measure'.")
    qubits: list[int] = Field(..., description="Target qubit indices (controls first for controlled gates).")
    params: list[float] = Field(default_factory=list, description="Rotation/phase parameters in radians.")
    clbit: int | None = Field(default=None, description="Classical bit index for 'measure'.")
    column: int = Field(default=0, description="Time-step column, used purely for layout.")


class ComposerCircuit(BaseModel):
    num_qubits: int = Field(..., ge=1)
    num_clbits: int = Field(default=0, ge=0)
    ops: list[GateOp] = Field(default_factory=list)


class CodeSource(BaseModel):
    """Qiskit source code that builds a circuit named ``qc`` (or ``circuit``)."""

    code: str


class ExecuteRequest(BaseModel):
    source_type: Literal["composer", "code"] = "composer"
    composer: ComposerCircuit | None = None
    code: str | None = None
    shots: int = Field(default=1024, ge=1)
    mode: Literal["aer", "ibm"] = "aer"


class BlochVector(BaseModel):
    qubit: int
    x: float
    y: float
    z: float


class Amplitude(BaseModel):
    basis: str
    real: float
    imag: float
    probability: float
    phase: float


class ExecuteResponse(BaseModel):
    counts: dict[str, int] | None = None
    amplitudes: list[Amplitude] | None = None
    bloch: list[BlochVector] | None = None
    diagram: str | None = None
    generated_code: str | None = None
    mode: str = "aer"
    warnings: list[str] = Field(default_factory=list)


class ConversionResponse(BaseModel):
    composer: ComposerCircuit | None = None
    code: str | None = None
    diagram: str | None = None

"""Derive visualization data (statevector amplitudes, Bloch vectors) from a circuit."""
from __future__ import annotations

import cmath

from qiskit import QuantumCircuit
from qiskit.quantum_info import DensityMatrix, Pauli, Statevector, partial_trace

from app.models.circuit import Amplitude, BlochVector

# Hide vanishingly small amplitudes from the UI.
_AMP_EPS = 1e-10


def _unitary_only(qc: QuantumCircuit) -> QuantumCircuit:
    """Return a copy with measurements/resets/barriers stripped, for statevector math."""
    clean = qc.copy_empty_like()
    for instr in qc.data:
        if instr.operation.name in {"measure", "reset", "barrier"}:
            continue
        clean.append(instr.operation, instr.qubits, instr.clbits)
    return clean


def statevector(qc: QuantumCircuit) -> Statevector:
    return Statevector.from_instruction(_unitary_only(qc))


def amplitudes(sv: Statevector) -> list[Amplitude]:
    n = sv.num_qubits
    data = sv.data
    out: list[Amplitude] = []
    for i, amp in enumerate(data):
        prob = float(abs(amp) ** 2)
        if prob < _AMP_EPS:
            continue
        # MSB-first label matches Qiskit's printed |q_{n-1}...q_0> ordering.
        basis = format(i, f"0{n}b")
        out.append(Amplitude(
            basis=basis,
            real=float(amp.real),
            imag=float(amp.imag),
            probability=prob,
            phase=float(cmath.phase(amp)),
        ))
    return out


def bloch_vectors(sv: Statevector) -> list[BlochVector]:
    """Per-qubit Bloch coordinates via the reduced single-qubit density matrix."""
    n = sv.num_qubits
    rho_full = DensityMatrix(sv)
    out: list[BlochVector] = []
    for q in range(n):
        trace_out = [j for j in range(n) if j != q]
        rho = partial_trace(rho_full, trace_out) if trace_out else rho_full
        x = float(rho.expectation_value(Pauli("X")).real)
        y = float(rho.expectation_value(Pauli("Y")).real)
        z = float(rho.expectation_value(Pauli("Z")).real)
        out.append(BlochVector(qubit=q, x=x, y=y, z=z))
    return out


def has_measurements(qc: QuantumCircuit) -> bool:
    return any(instr.operation.name == "measure" for instr in qc.data)

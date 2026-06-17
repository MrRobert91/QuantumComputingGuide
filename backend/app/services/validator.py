"""Validate a user's circuit against an exercise's reference solution.

Equivalence is checked up to global phase using the circuits' operators (for
unitary exercises) or statevectors (when a specific output state is targeted),
so any gate decomposition that produces the same transformation is accepted.
"""
from __future__ import annotations

from qiskit import QuantumCircuit
from qiskit.quantum_info import Operator, Statevector

from app.services.visualization import _unitary_only


def check_equivalence(user: QuantumCircuit, reference: QuantumCircuit) -> tuple[bool, str]:
    if user.num_qubits != reference.num_qubits:
        return False, (
            f"Expected {reference.num_qubits} qubit(s) but your circuit has "
            f"{user.num_qubits}."
        )

    u_user = _unitary_only(user)
    u_ref = _unitary_only(reference)

    try:
        if Operator(u_ref).equiv(Operator(u_user)):
            return True, "Correct! Your circuit matches the expected transformation."
    except Exception:  # noqa: BLE001 - fall back to statevector comparison
        pass

    try:
        sv_user = Statevector.from_instruction(u_user)
        sv_ref = Statevector.from_instruction(u_ref)
        if sv_ref.equiv(sv_user):
            return True, "Correct! Your output state matches the expected state."
    except Exception:  # noqa: BLE001
        pass

    return False, "Not quite — the resulting state/transformation does not match yet."

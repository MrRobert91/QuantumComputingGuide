import math

from app.models.circuit import ComposerCircuit, GateOp
from app.services import circuit_model
from app.services.executor import execute_circuit
from app.services import visualization as viz


def test_bell_state_counts_are_correlated():
    composer = ComposerCircuit(
        num_qubits=2,
        num_clbits=2,
        ops=[
            GateOp(name="h", qubits=[0], column=0),
            GateOp(name="cx", qubits=[0, 1], column=1),
            GateOp(name="measure", qubits=[0], clbit=0, column=2),
            GateOp(name="measure", qubits=[1], clbit=1, column=2),
        ],
    )
    qc = circuit_model.composer_to_circuit(composer)
    resp = execute_circuit(qc, shots=2000, mode="aer")
    assert resp.counts is not None
    # Only correlated outcomes should appear (00 and 11).
    assert set(resp.counts) <= {"00", "11"}
    assert sum(resp.counts.values()) == 2000


def test_bloch_vector_of_plus_state():
    composer = ComposerCircuit(num_qubits=1, ops=[GateOp(name="h", qubits=[0])])
    qc = circuit_model.composer_to_circuit(composer)
    sv = viz.statevector(qc)
    bloch = viz.bloch_vectors(sv)[0]
    assert math.isclose(bloch.x, 1.0, abs_tol=1e-6)
    assert math.isclose(bloch.z, 0.0, abs_tol=1e-6)


def test_no_measurement_returns_amplitudes_only():
    composer = ComposerCircuit(num_qubits=1, ops=[GateOp(name="x", qubits=[0])])
    qc = circuit_model.composer_to_circuit(composer)
    resp = execute_circuit(qc, shots=100, mode="aer")
    assert resp.counts is None
    assert resp.amplitudes is not None
    assert resp.amplitudes[0].basis == "1"

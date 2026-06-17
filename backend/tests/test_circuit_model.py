import math

from app.models.circuit import ComposerCircuit, GateOp
from app.services import circuit_model


def _bell() -> ComposerCircuit:
    return ComposerCircuit(
        num_qubits=2,
        num_clbits=0,
        ops=[GateOp(name="h", qubits=[0], column=0), GateOp(name="cx", qubits=[0, 1], column=1)],
    )


def test_composer_to_circuit_builds_expected_gates():
    qc = circuit_model.composer_to_circuit(_bell())
    assert qc.num_qubits == 2
    names = [instr.operation.name for instr in qc.data]
    assert names == ["h", "cx"]


def test_composer_code_roundtrip_via_circuit():
    composer = _bell()
    code = circuit_model.composer_to_code(composer)
    assert "qc.h(0)" in code
    assert "qc.cx(0, 1)" in code


def test_circuit_to_composer_inverse():
    qc = circuit_model.composer_to_circuit(_bell())
    back = circuit_model.circuit_to_composer(qc)
    assert back.num_qubits == 2
    assert [op.name for op in back.ops] == ["h", "cx"]


def test_param_gate_formats_pi():
    composer = ComposerCircuit(
        num_qubits=1, ops=[GateOp(name="rx", qubits=[0], params=[math.pi])]
    )
    code = circuit_model.composer_to_code(composer)
    assert "np.pi" in code


def test_measure_adds_classical_bits():
    composer = ComposerCircuit(
        num_qubits=1,
        ops=[GateOp(name="h", qubits=[0]), GateOp(name="measure", qubits=[0], clbit=0)],
    )
    qc = circuit_model.composer_to_circuit(composer)
    assert qc.num_clbits == 1

"""Conversions between the canonical composer schema, Qiskit circuits, and code.

    ComposerCircuit  <-->  QuantumCircuit  -->  Qiskit source code

``circuit_to_composer`` lets us render code-built circuits back into the visual
composer (code -> composer sync), and ``composer_to_code`` powers composer -> code.
"""
from __future__ import annotations

import math

from qiskit import QuantumCircuit

from app.models.circuit import ComposerCircuit, GateOp, SUPPORTED_GATES

# Maps composer gate name -> QuantumCircuit method name.
_QC_METHOD = {
    "h": "h", "x": "x", "y": "y", "z": "z", "s": "s", "sdg": "sdg",
    "t": "t", "tdg": "tdg", "sx": "sx", "id": "id",
    "rx": "rx", "ry": "ry", "rz": "rz", "p": "p",
    "cx": "cx", "cz": "cz", "swap": "swap", "ccx": "ccx",
}


def composer_to_circuit(model: ComposerCircuit) -> QuantumCircuit:
    """Build a Qiskit ``QuantumCircuit`` from the canonical composer schema."""
    nclbits = model.num_clbits
    if nclbits == 0 and any(op.name == "measure" for op in model.ops):
        nclbits = model.num_qubits
    qc = QuantumCircuit(model.num_qubits, nclbits)

    # Preserve user intent: apply ops ordered by (column, original index).
    ordered = sorted(enumerate(model.ops), key=lambda pair: (pair[1].column, pair[0]))
    for _, op in ordered:
        if op.name not in SUPPORTED_GATES:
            raise ValueError(f"Unsupported gate: {op.name!r}")
        n_targets, n_params = SUPPORTED_GATES[op.name]
        if len(op.qubits) != n_targets:
            raise ValueError(
                f"Gate {op.name!r} expects {n_targets} qubit(s), got {len(op.qubits)}"
            )
        if len(op.params) != n_params:
            raise ValueError(
                f"Gate {op.name!r} expects {n_params} param(s), got {len(op.params)}"
            )
        for q in op.qubits:
            if not 0 <= q < model.num_qubits:
                raise ValueError(f"Qubit index {q} out of range")

        if op.name == "measure":
            clbit = op.clbit if op.clbit is not None else op.qubits[0]
            qc.measure(op.qubits[0], clbit)
            continue

        method = getattr(qc, _QC_METHOD[op.name])
        method(*op.params, *op.qubits)
    return qc


def circuit_to_composer(qc: QuantumCircuit) -> ComposerCircuit:
    """Introspect a Qiskit circuit into the canonical composer schema."""
    ops: list[GateOp] = []
    qubit_index = {bit: i for i, bit in enumerate(qc.qubits)}
    clbit_index = {bit: i for i, bit in enumerate(qc.clbits)}

    for column, instr in enumerate(qc.data):
        op = instr.operation
        name = op.name
        qubits = [qubit_index[b] for b in instr.qubits]
        if name == "measure":
            clbit = clbit_index[instr.clbits[0]] if instr.clbits else qubits[0]
            ops.append(GateOp(name="measure", qubits=qubits, clbit=clbit, column=column))
            continue
        if name not in SUPPORTED_GATES:
            # Unknown/decomposed gate: keep its name so the UI can show it as opaque.
            ops.append(GateOp(name=name, qubits=qubits,
                              params=[float(p) for p in op.params], column=column))
            continue
        ops.append(GateOp(
            name=name,
            qubits=qubits,
            params=[float(p) for p in op.params],
            column=column,
        ))

    return ComposerCircuit(num_qubits=qc.num_qubits, num_clbits=qc.num_clbits, ops=ops)


def _fmt_param(value: float) -> str:
    """Render a parameter using readable pi-fractions when possible."""
    candidates = {
        "np.pi": math.pi,
        "np.pi/2": math.pi / 2,
        "np.pi/3": math.pi / 3,
        "np.pi/4": math.pi / 4,
    }
    for label, val in candidates.items():
        if math.isclose(value, val, abs_tol=1e-9):
            return label
        if math.isclose(value, -val, abs_tol=1e-9):
            return f"-{label}"
    return repr(round(value, 10))


def composer_to_code(model: ComposerCircuit) -> str:
    """Generate readable Qiskit source code from the composer schema."""
    nclbits = model.num_clbits
    if nclbits == 0 and any(op.name == "measure" for op in model.ops):
        nclbits = model.num_qubits

    lines = ["import numpy as np", "from qiskit import QuantumCircuit", ""]
    if nclbits:
        lines.append(f"qc = QuantumCircuit({model.num_qubits}, {nclbits})")
    else:
        lines.append(f"qc = QuantumCircuit({model.num_qubits})")

    ordered = sorted(enumerate(model.ops), key=lambda pair: (pair[1].column, pair[0]))
    for _, op in ordered:
        if op.name == "measure":
            clbit = op.clbit if op.clbit is not None else op.qubits[0]
            lines.append(f"qc.measure({op.qubits[0]}, {clbit})")
            continue
        args = [_fmt_param(p) for p in op.params] + [str(q) for q in op.qubits]
        method = _QC_METHOD.get(op.name, op.name)
        lines.append(f"qc.{method}({', '.join(args)})")

    return "\n".join(lines) + "\n"

"""Execute circuits on the local Aer simulator or (optionally) IBM Quantum."""
from __future__ import annotations

from qiskit import QuantumCircuit, transpile

from app.core.config import get_settings
from app.models.circuit import ExecuteResponse
from app.services import visualization as viz


def _sampling_counts_aer(qc: QuantumCircuit, shots: int) -> dict[str, int]:
    """Run a measured circuit on Aer and return measurement counts."""
    from qiskit_aer import AerSimulator

    sim = AerSimulator()
    tqc = transpile(qc, sim)
    result = sim.run(tqc, shots=shots).result()
    counts = result.get_counts()
    # Normalize keys to plain bitstrings (drop spaces from multi-register labels).
    return {k.replace(" ", ""): int(v) for k, v in counts.items()}


def _sampling_counts_ibm(qc: QuantumCircuit, shots: int) -> dict[str, int]:
    """Run a measured circuit on the least-busy IBM backend via Runtime SamplerV2."""
    from qiskit_ibm_runtime import QiskitRuntimeService, SamplerV2
    from qiskit.transpiler.preset_passmanagers import generate_preset_pass_manager

    settings = get_settings()
    service = QiskitRuntimeService(
        channel=settings.ibm_quantum_channel,
        token=settings.ibm_quantum_token,
        instance=settings.ibm_quantum_instance or None,
    )
    backend = service.least_busy(operational=True, simulator=False)
    pm = generate_preset_pass_manager(optimization_level=1, backend=backend)
    isa = pm.run(qc)
    sampler = SamplerV2(mode=backend)
    job = sampler.run([isa], shots=shots)
    result = job.result()
    creg = qc.cregs[0].name if qc.cregs else "c"
    bitarray = getattr(result[0].data, creg)
    return {k.replace(" ", ""): int(v) for k, v in bitarray.get_counts().items()}


def execute_circuit(qc: QuantumCircuit, shots: int, mode: str) -> ExecuteResponse:
    """Compute statevector visuals (always) and counts (when measured)."""
    settings = get_settings()
    shots = min(shots, settings.max_shots)
    warnings: list[str] = []

    if qc.num_qubits > settings.max_qubits:
        raise ValueError(
            f"Circuit has {qc.num_qubits} qubits; the limit is {settings.max_qubits}."
        )

    # Statevector-based visuals are computed from the unitary part of the circuit.
    sv = viz.statevector(qc)
    amps = viz.amplitudes(sv)
    bloch = viz.bloch_vectors(sv)
    diagram = qc.draw(output="text").single_string()

    counts: dict[str, int] | None = None
    effective_mode = mode
    if viz.has_measurements(qc):
        if mode == "ibm":
            if not settings.ibm_enabled:
                warnings.append("IBM Quantum token not configured; ran on Aer instead.")
                effective_mode = "aer"
                counts = _sampling_counts_aer(qc, shots)
            else:
                counts = _sampling_counts_ibm(qc, shots)
        else:
            counts = _sampling_counts_aer(qc, shots)
    else:
        warnings.append("No measurements in circuit; showing statevector only.")

    return ExecuteResponse(
        counts=counts,
        amplitudes=amps,
        bloch=bloch,
        diagram=diagram,
        mode=effective_mode,
        warnings=warnings,
    )

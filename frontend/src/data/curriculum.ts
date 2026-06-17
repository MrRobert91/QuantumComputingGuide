// Curriculum tree for the Qiskit v2.x Developer certification prep app.
//
// Content is ORIGINAL, written to cover the same objectives as IBM's open
// materials, with links back to the authoritative sources (Qiskit docs and
// IBM Quantum Learning). Foundational modules ("foundations", "gates") are
// fully written; later modules are scaffolded with objectives + links and are
// meant to be filled in incrementally.

export type LessonStatus = "complete" | "scaffold";

export interface Lesson {
  id: string;
  title: string;
  status: LessonStatus;
  /** Optional interactive widget rendered inside the lesson page. */
  widget?: "bloch" | "superposition" | "amplitudes" | "gates";
  content: string; // Markdown
}

export interface Module {
  id: string;
  title: string;
  examWeight?: string;
  summary: string;
  lessons: Lesson[];
}

const IBM_LINKS = `
> **Official sources:** [Qiskit documentation](https://docs.quantum.ibm.com/) ·
> [IBM Quantum Learning](https://learning.quantum.ibm.com/) ·
> [Certification overview](https://www.ibm.com/quantum/blog/qiskit-v2x-developer-certification)
`;

export const curriculum: Module[] = [
  {
    id: "foundations",
    title: "1. Quantum Computing Foundations",
    examWeight: "Foundational",
    summary:
      "Qubits, superposition, the Bloch sphere, measurement, and Dirac notation — the vocabulary everything else builds on.",
    lessons: [
      {
        id: "foundations-qubits",
        title: "Qubits & quantum states",
        status: "complete",
        widget: "amplitudes",
        content: `# Qubits & quantum states

A **classical bit** is either 0 or 1. A **qubit** can be in state \`|0⟩\`, state \`|1⟩\`, or any
**superposition** of the two. We write a general single-qubit state in **Dirac (bra-ket) notation** as:

\`\`\`
|ψ⟩ = α|0⟩ + β|1⟩
\`\`\`

where \`α\` and \`β\` are complex numbers called **amplitudes**, subject to the normalization rule:

\`\`\`
|α|² + |β|² = 1
\`\`\`

## Amplitudes and probabilities

The amplitudes are not probabilities themselves. When you **measure** the qubit in the
computational basis, you get:

- outcome \`0\` with probability \`|α|²\`
- outcome \`1\` with probability \`|β|²\`

This is the **Born rule**. Because the amplitudes are complex, two states can have the same
measurement probabilities but different **phases** — and phase is what makes interference (and
quantum algorithms) possible.

## State vectors

It is often convenient to represent a state as a column vector:

\`\`\`
|0⟩ = [1, 0]ᵀ        |1⟩ = [0, 1]ᵀ
|ψ⟩ = [α, β]ᵀ
\`\`\`

In Qiskit you can inspect a circuit's state vector with \`qiskit.quantum_info.Statevector\`:

\`\`\`python
from qiskit import QuantumCircuit
from qiskit.quantum_info import Statevector

qc = QuantumCircuit(1)
qc.h(0)
state = Statevector.from_instruction(qc)
print(state.data)   # [0.707..+0j, 0.707..+0j]
\`\`\`

> Try the **amplitude explorer** below: apply gates and watch the amplitudes, probabilities,
> and phases update live.

${IBM_LINKS}`,
      },
      {
        id: "foundations-superposition",
        title: "Superposition",
        status: "complete",
        widget: "superposition",
        content: `# Superposition

**Superposition** means a qubit holds a weighted combination of \`|0⟩\` and \`|1⟩\` at the same time.
The canonical example is the **|+⟩ state**, produced by applying a **Hadamard (H)** gate to \`|0⟩\`:

\`\`\`
H|0⟩ = (|0⟩ + |1⟩)/√2 = |+⟩
\`\`\`

Measuring \`|+⟩\` in the computational basis yields 0 or 1 with **50% probability each**.

## Why it is not just "random"

A fair coin is also 50/50, so what's the difference? **Phase and interference.** Apply a second
Hadamard and the superposition collapses back to a definite \`|0⟩\`:

\`\`\`
H(H|0⟩) = |0⟩
\`\`\`

The two computational paths **interfere**: amplitudes for one outcome add, while amplitudes for the
other cancel. A classical coin flipped twice never returns to a guaranteed result — superposition is
fundamentally different.

## The |−⟩ state

Applying H to \`|1⟩\` gives the \`|−⟩\` state, which has the same 50/50 probabilities but an opposite
relative phase:

\`\`\`
H|1⟩ = (|0⟩ − |1⟩)/√2 = |−⟩
\`\`\`

> Use the **superposition demo** below to flip a qubit between definite and superposed states and
> see the measurement statistics.

${IBM_LINKS}`,
      },
      {
        id: "foundations-bloch",
        title: "The Bloch sphere",
        status: "complete",
        widget: "bloch",
        content: `# The Bloch sphere

Any **single-qubit pure state** can be drawn as a point on the surface of a unit sphere — the
**Bloch sphere**. It is the single most useful mental picture in quantum computing.

\`\`\`
|ψ⟩ = cos(θ/2)|0⟩ + e^{iφ} sin(θ/2)|1⟩
\`\`\`

- \`θ\` (polar angle) controls the **probability split** between \`|0⟩\` and \`|1⟩\`.
- \`φ\` (azimuthal angle) is the **relative phase**.

## Landmarks

| State | Position on the sphere |
|-------|------------------------|
| \`|0⟩\` | North pole (+Z) |
| \`|1⟩\` | South pole (−Z) |
| \`|+⟩\` | +X axis |
| \`|−⟩\` | −X axis |
| \`|i⟩\` | +Y axis |

## Gates as rotations

Single-qubit gates are **rotations** of the Bloch vector:

- **X** rotates 180° about the X axis (\`|0⟩ ↔ |1⟩\`).
- **Z** rotates 180° about the Z axis (adds a phase to \`|1⟩\`).
- **H** maps the Z axis to the X axis (\`|0⟩ → |+⟩\`).
- **RX(θ), RY(θ), RZ(θ)** rotate by an arbitrary angle about each axis.

> Rotate the **interactive Bloch sphere** below and apply gates to see how the state vector moves.

${IBM_LINKS}`,
      },
      {
        id: "foundations-measurement",
        title: "Measurement & Dirac notation",
        status: "complete",
        content: `# Measurement & Dirac notation

## Measurement collapses the state

Measurement is **probabilistic and irreversible**. Measuring \`|ψ⟩ = α|0⟩ + β|1⟩\` returns:

- \`0\` with probability \`|α|²\`, after which the state becomes \`|0⟩\`;
- \`1\` with probability \`|β|²\`, after which the state becomes \`|1⟩\`.

Repeated runs ("**shots**") let you estimate these probabilities from the resulting **counts**.

## Dirac notation cheat sheet

- **Ket** \`|ψ⟩\`: a column vector (a state).
- **Bra** \`⟨ψ|\`: the conjugate transpose of the ket (a row vector).
- **Inner product** \`⟨φ|ψ⟩\`: a complex number; \`|⟨φ|ψ⟩|²\` is the probability of measuring \`|ψ⟩\` as \`|φ⟩\`.
- **Outer product** \`|ψ⟩⟨φ|\`: a matrix (an operator).

## Measuring in Qiskit

\`\`\`python
from qiskit import QuantumCircuit

qc = QuantumCircuit(1, 1)   # 1 qubit, 1 classical bit
qc.h(0)
qc.measure(0, 0)            # store the result in classical bit 0
\`\`\`

The classical bit records the outcome so you can read it back after execution.

${IBM_LINKS}`,
      },
    ],
  },
  {
    id: "gates",
    title: "2. Quantum Gates & Operations",
    examWeight: "Foundational",
    summary:
      "Single- and multi-qubit gates, controlled operations, and how to apply them in Qiskit.",
    lessons: [
      {
        id: "gates-single",
        title: "Single-qubit gates",
        status: "complete",
        widget: "gates",
        content: `# Single-qubit gates

Single-qubit gates are **2×2 unitary matrices**. Unitarity (\`U†U = I\`) guarantees they are
reversible and preserve normalization.

## The Pauli gates

| Gate | Effect | Matrix (rows) |
|------|--------|---------------|
| **X** | bit flip \`|0⟩↔|1⟩\` | [[0,1],[1,0]] |
| **Y** | bit + phase flip | [[0,−i],[i,0]] |
| **Z** | phase flip on \`|1⟩\` | [[1,0],[0,−1]] |

## Hadamard, phase, and rotations

- **H** — creates superposition: \`H|0⟩ = |+⟩\`.
- **S**, **S†**, **T**, **T†** — phase gates (S = 90°, T = 45° about Z).
- **RX(θ), RY(θ), RZ(θ)** — parameterized rotations.
- **P(λ)** — general phase gate.

\`\`\`python
qc.h(0)          # Hadamard
qc.x(0)          # Pauli-X
qc.rz(3.14, 0)   # Z rotation by π
qc.p(1.57, 0)    # phase gate
\`\`\`

> Use the **gate playground** below to apply each gate and watch the Bloch vector rotate.

${IBM_LINKS}`,
      },
      {
        id: "gates-multi",
        title: "Multi-qubit & controlled gates",
        status: "complete",
        content: `# Multi-qubit & controlled gates

Multi-qubit gates create **correlations and entanglement** between qubits.

## CNOT (CX)

The **controlled-NOT** flips the target qubit **iff** the control qubit is \`|1⟩\`:

\`\`\`
CX|00⟩ = |00⟩      CX|10⟩ = |11⟩
CX|01⟩ = |01⟩      CX|11⟩ = |10⟩
\`\`\`

\`\`\`python
qc.cx(0, 1)   # control = qubit 0, target = qubit 1
\`\`\`

## Other common multi-qubit gates

- **CZ** — applies a phase flip when both qubits are \`|1⟩\`.
- **SWAP** — exchanges the states of two qubits.
- **CCX (Toffoli)** — flips the target only if **both** controls are \`|1⟩\`.

## Entanglement & the Bell state

Combining H and CX produces an **entangled** Bell state:

\`\`\`python
qc = QuantumCircuit(2)
qc.h(0)
qc.cx(0, 1)   # (|00⟩ + |11⟩)/√2
\`\`\`

Measuring one qubit instantly determines the other — the outcomes are perfectly correlated.

> Build this in the **Playground** and confirm you only ever see \`00\` and \`11\`.

${IBM_LINKS}`,
      },
    ],
  },
  {
    id: "circuits",
    title: "3. Building Circuits with Qiskit",
    examWeight: "~18%",
    summary:
      "QuantumCircuit, registers, parameterized circuits, and dynamic / control-flow circuits.",
    lessons: [
      {
        id: "circuits-quantumcircuit",
        title: "QuantumCircuit & registers",
        status: "scaffold",
        content: `# QuantumCircuit & registers

**Learning objectives**

- Create circuits with \`QuantumCircuit\`, \`QuantumRegister\`, and \`ClassicalRegister\`.
- Add gates, barriers, and measurements.
- Compose and append circuits.

_This lesson is scaffolded. Core APIs to cover: \`QuantumCircuit(n, m)\`, \`qc.compose()\`,
\`qc.append()\`, \`qc.barrier()\`, \`qc.measure_all()\`._

${IBM_LINKS}`,
      },
      {
        id: "circuits-parameterized",
        title: "Parameterized & dynamic circuits",
        status: "scaffold",
        content: `# Parameterized & dynamic circuits

**Learning objectives**

- Build parameterized circuits with \`Parameter\` and \`ParameterVector\`.
- Bind parameters with \`assign_parameters\`.
- Use **dynamic circuits**: mid-circuit measurement and classical control flow
  (\`if_test\`, \`switch\`, \`for_loop\`).

_Scaffolded — to be expanded._

${IBM_LINKS}`,
      },
    ],
  },
  {
    id: "operators",
    title: "4. Operators & Observables",
    examWeight: "Core",
    summary: "Pauli operators and SparsePauliOp for expectation values.",
    lessons: [
      {
        id: "operators-pauli",
        title: "Pauli & SparsePauliOp",
        status: "scaffold",
        content: `# Pauli operators & observables

**Learning objectives**

- Construct \`Pauli\` and \`SparsePauliOp\` observables.
- Understand expectation values \`⟨ψ|O|ψ⟩\`.
- Prepare observables for the Estimator primitive.

_Scaffolded — to be expanded._

${IBM_LINKS}`,
      },
    ],
  },
  {
    id: "primitives",
    title: "5. Primitives V2 (Sampler & Estimator)",
    examWeight: "Core",
    summary:
      "The SamplerV2 and EstimatorV2 interfaces, PUBs, and broadcasting rules.",
    lessons: [
      {
        id: "primitives-overview",
        title: "SamplerV2 & EstimatorV2",
        status: "scaffold",
        content: `# Primitives V2

**Learning objectives**

- Use \`SamplerV2\` to sample measurement outcomes and \`EstimatorV2\` to estimate expectation values.
- Build **PUBs** (Primitive Unified Blocs): \`(circuit, observables, parameter_values)\`.
- Apply **broadcasting** rules across parameter sets.

_Scaffolded — to be expanded._

${IBM_LINKS}`,
      },
    ],
  },
  {
    id: "runtime",
    title: "6. Qiskit Runtime & Execution Modes",
    examWeight: "Core",
    summary: "Jobs, sessions, batch mode, and selecting backends.",
    lessons: [
      {
        id: "runtime-modes",
        title: "Job, Session & Batch modes",
        status: "scaffold",
        content: `# Qiskit Runtime & execution modes

**Learning objectives**

- Connect with \`QiskitRuntimeService\` and pick a backend (\`least_busy\`).
- Understand **job**, **session**, and **batch** execution modes and when to use each.
- Run primitives against real IBM Quantum hardware.

_Scaffolded — to be expanded. In this app, set \`IBM_QUANTUM_TOKEN\` to enable the "IBM Quantum" run mode._

${IBM_LINKS}`,
      },
    ],
  },
  {
    id: "transpilation",
    title: "7. Transpilation",
    examWeight: "Core",
    summary:
      "Preset pass managers, optimization levels, ISA circuits, layout and routing.",
    lessons: [
      {
        id: "transpilation-overview",
        title: "Preset pass managers & ISA circuits",
        status: "scaffold",
        content: `# Transpilation

**Learning objectives**

- Use \`generate_preset_pass_manager\` and optimization levels 0–3.
- Understand **ISA circuits** (instruction set architecture) targeting a backend.
- Reason about layout, routing, and gate decomposition.

> Try the **Transpile** panel in the Playground to see depth and gate counts change with the
> optimization level.

_Scaffolded — to be expanded._

${IBM_LINKS}`,
      },
    ],
  },
  {
    id: "visualization",
    title: "8. Visualization",
    examWeight: "~7%",
    summary: "Drawing circuits and plotting results and states.",
    lessons: [
      {
        id: "visualization-tools",
        title: "Circuit & state visualization",
        status: "scaffold",
        content: `# Visualization

**Learning objectives**

- Draw circuits with \`qc.draw()\`.
- Plot results with \`plot_histogram\`.
- Visualize states with \`plot_bloch_multivector\` and \`plot_state_city\`.

> This app provides interactive equivalents: a Bloch sphere, a measurement histogram, and an
> amplitude/phase chart in the Playground.

_Scaffolded — to be expanded._

${IBM_LINKS}`,
      },
    ],
  },
  {
    id: "openqasm",
    title: "9. OpenQASM 3",
    examWeight: "Supporting",
    summary: "Importing and exporting circuits as OpenQASM 3.",
    lessons: [
      {
        id: "openqasm-io",
        title: "Import & export OpenQASM 3",
        status: "scaffold",
        content: `# OpenQASM 3

**Learning objectives**

- Export a circuit with \`qiskit.qasm3.dumps\`.
- Import a program with \`qiskit.qasm3.loads\`.
- Recognize OpenQASM 3 syntax for gates, registers, and measurement.

_Scaffolded — to be expanded. (This app uses OpenQASM 3 internally to round-trip circuits safely.)_

${IBM_LINKS}`,
      },
    ],
  },
];

export function findLesson(lessonId: string): { module: Module; lesson: Lesson } | undefined {
  for (const module of curriculum) {
    const lesson = module.lessons.find((l) => l.id === lessonId);
    if (lesson) return { module, lesson };
  }
  return undefined;
}

export const allLessons = curriculum.flatMap((m) => m.lessons);

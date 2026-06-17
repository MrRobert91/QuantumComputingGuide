// Starter question bank for the mock exam. Original questions written to mirror
// the style and topics of the Qiskit v2.x Developer exam. Expand over time.

export interface Question {
  id: string;
  topic: string;
  question: string;
  options: string[];
  answer: number; // index into options
  explanation: string;
}

export const examQuestions: Question[] = [
  {
    id: "q-hadamard",
    topic: "Gates",
    question: "Which gate creates an equal superposition from the |0⟩ state?",
    options: ["X", "Z", "H (Hadamard)", "T"],
    answer: 2,
    explanation: "The Hadamard gate maps |0⟩ to |+⟩ = (|0⟩ + |1⟩)/√2, an equal superposition.",
  },
  {
    id: "q-bell",
    topic: "Circuits",
    question: "Which sequence of gates prepares the Bell state (|00⟩ + |11⟩)/√2?",
    options: [
      "qc.x(0); qc.cx(0, 1)",
      "qc.h(0); qc.cx(0, 1)",
      "qc.h(0); qc.h(1)",
      "qc.cx(0, 1); qc.h(1)",
    ],
    answer: 1,
    explanation: "A Hadamard on qubit 0 followed by a CNOT (control 0, target 1) entangles the qubits into the Φ+ Bell state.",
  },
  {
    id: "q-primitive-sampler",
    topic: "Primitives",
    question: "Which Qiskit primitive should you use to obtain measurement bitstring distributions?",
    options: ["EstimatorV2", "SamplerV2", "BackendV2", "SparsePauliOp"],
    answer: 1,
    explanation: "SamplerV2 samples measurement outcomes (counts/bitstrings); EstimatorV2 computes expectation values of observables.",
  },
  {
    id: "q-cx-truth",
    topic: "Gates",
    question: "What does CX (CNOT) do to the state |10⟩ (control = qubit 0 = 1)?",
    options: ["Leaves it as |10⟩", "Maps it to |11⟩", "Maps it to |00⟩", "Maps it to |01⟩"],
    answer: 1,
    explanation: "CNOT flips the target (qubit 1) when the control (qubit 0) is 1, so |10⟩ → |11⟩.",
  },
  {
    id: "q-transpile",
    topic: "Transpilation",
    question: "What is the purpose of transpiling a circuit to an ISA circuit before running on hardware?",
    options: [
      "To increase the number of qubits",
      "To express the circuit using the backend's native gates and connectivity",
      "To measure all qubits automatically",
      "To convert it to OpenQASM 2",
    ],
    answer: 1,
    explanation: "Transpilation rewrites the circuit into the backend's instruction set (native gates) and respects its qubit connectivity, producing an ISA circuit.",
  },
  {
    id: "q-measure-prob",
    topic: "Foundations",
    question: "For |ψ⟩ = α|0⟩ + β|1⟩, the probability of measuring 1 is:",
    options: ["β", "|β|²", "|α|²", "α + β"],
    answer: 1,
    explanation: "By the Born rule, the probability of outcome 1 is the squared magnitude of its amplitude, |β|².",
  },
];

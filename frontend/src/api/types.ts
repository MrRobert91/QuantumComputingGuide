// Mirrors the backend pydantic schemas (app/models/circuit.py).

export interface GateOp {
  name: string;
  qubits: number[];
  params?: number[];
  clbit?: number | null;
  column?: number;
}

export interface ComposerCircuit {
  num_qubits: number;
  num_clbits: number;
  ops: GateOp[];
}

export interface Amplitude {
  basis: string;
  real: number;
  imag: number;
  probability: number;
  phase: number;
}

export interface BlochVector {
  qubit: number;
  x: number;
  y: number;
  z: number;
}

export interface ExecuteResponse {
  counts: Record<string, number> | null;
  amplitudes: Amplitude[] | null;
  bloch: BlochVector[] | null;
  diagram: string | null;
  generated_code: string | null;
  mode: string;
  warnings: string[];
}

export interface ConversionResponse {
  composer?: ComposerCircuit | null;
  code?: string | null;
  diagram?: string | null;
}

export interface BackendsInfo {
  modes: string[];
  ibm_enabled: boolean;
  max_qubits: number;
  max_shots: number;
}

export interface Exercise {
  id: string;
  module: string;
  title: string;
  prompt: string;
  difficulty: string;
  num_qubits: number;
  hints: string[];
  starting_composer: ComposerCircuit;
  links: { label: string; url: string }[];
}

export interface ValidateResponse {
  passed: boolean;
  message: string;
}

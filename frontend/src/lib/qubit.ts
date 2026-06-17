// Minimal single-qubit simulator (complex 2-vector) for the interactive lesson
// widgets. Multi-qubit execution always goes through the backend; this just keeps
// the Bloch/superposition/amplitude demos snappy and offline.

export interface Complex {
  re: number;
  im: number;
}

export type State = [Complex, Complex]; // [amplitude of |0>, amplitude of |1>]

const c = (re: number, im = 0): Complex => ({ re, im });
const add = (a: Complex, b: Complex): Complex => c(a.re + b.re, a.im + b.im);
const mul = (a: Complex, b: Complex): Complex =>
  c(a.re * b.re - a.im * b.im, a.re * b.im + a.im * b.re);

export const ZERO: State = [c(1), c(0)];

const SQRT1_2 = Math.SQRT1_2;

export type GateName =
  | "h" | "x" | "y" | "z" | "s" | "sdg" | "t" | "tdg" | "sx"
  | "rx" | "ry" | "rz" | "p";

// 2x2 gate matrices (possibly parameterized).
function matrix(name: GateName, theta = 0): [Complex, Complex, Complex, Complex] {
  switch (name) {
    case "h":
      return [c(SQRT1_2), c(SQRT1_2), c(SQRT1_2), c(-SQRT1_2)];
    case "x":
      return [c(0), c(1), c(1), c(0)];
    case "y":
      return [c(0), c(0, -1), c(0, 1), c(0)];
    case "z":
      return [c(1), c(0), c(0), c(-1)];
    case "s":
      return [c(1), c(0), c(0), c(0, 1)];
    case "sdg":
      return [c(1), c(0), c(0), c(0, -1)];
    case "t":
      return [c(1), c(0), c(0), c(Math.cos(Math.PI / 4), Math.sin(Math.PI / 4))];
    case "tdg":
      return [c(1), c(0), c(0), c(Math.cos(-Math.PI / 4), Math.sin(-Math.PI / 4))];
    case "sx":
      return [
        c(0.5, 0.5), c(0.5, -0.5),
        c(0.5, -0.5), c(0.5, 0.5),
      ];
    case "rx": {
      const ct = Math.cos(theta / 2), st = Math.sin(theta / 2);
      return [c(ct), c(0, -st), c(0, -st), c(ct)];
    }
    case "ry": {
      const ct = Math.cos(theta / 2), st = Math.sin(theta / 2);
      return [c(ct), c(-st), c(st), c(ct)];
    }
    case "rz": {
      return [
        c(Math.cos(-theta / 2), Math.sin(-theta / 2)), c(0),
        c(0), c(Math.cos(theta / 2), Math.sin(theta / 2)),
      ];
    }
    case "p":
      return [c(1), c(0), c(0), c(Math.cos(theta), Math.sin(theta))];
  }
}

export function applyGate(state: State, name: GateName, theta = 0): State {
  const [m00, m01, m10, m11] = matrix(name, theta);
  return [
    add(mul(m00, state[0]), mul(m01, state[1])),
    add(mul(m10, state[0]), mul(m11, state[1])),
  ];
}

export function applyGates(gates: { name: GateName; theta?: number }[]): State {
  return gates.reduce((s, g) => applyGate(s, g.name, g.theta ?? 0), ZERO);
}

const absSq = (z: Complex) => z.re * z.re + z.im * z.im;
const conj = (z: Complex): Complex => c(z.re, -z.im);

export function probabilities(state: State): { p0: number; p1: number } {
  return { p0: absSq(state[0]), p1: absSq(state[1]) };
}

export function phase(z: Complex): number {
  return Math.atan2(z.im, z.re);
}

// Bloch coordinates from the single-qubit state vector.
export function blochVector(state: State): { x: number; y: number; z: number } {
  const [a, b] = state;
  const ab = mul(conj(a), b); // <0|rho|1> style term
  return {
    x: 2 * ab.re,
    y: 2 * ab.im,
    z: absSq(a) - absSq(b),
  };
}

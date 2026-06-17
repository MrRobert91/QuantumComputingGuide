import { useMemo, useState } from "react";
import { applyGates, blochVector, phase, probabilities, type GateName } from "../../lib/qubit";
import { BlochSphere } from "./BlochSphere";
import { AmplitudeBars } from "./AmplitudeBars";
import type { Amplitude } from "../../api/types";

type Variant = "bloch" | "superposition" | "amplitudes" | "gates";

const GATES: { name: GateName; label: string; theta?: number }[] = [
  { name: "h", label: "H" },
  { name: "x", label: "X" },
  { name: "y", label: "Y" },
  { name: "z", label: "Z" },
  { name: "s", label: "S" },
  { name: "t", label: "T" },
  { name: "sx", label: "√X" },
  { name: "rx", label: "RX(π/2)", theta: Math.PI / 2 },
  { name: "ry", label: "RY(π/2)", theta: Math.PI / 2 },
  { name: "rz", label: "RZ(π/2)", theta: Math.PI / 2 },
];

export function InteractiveQubit({ variant }: { variant: Variant }) {
  const [seq, setSeq] = useState<{ name: GateName; theta?: number }[]>([]);

  const state = useMemo(() => applyGates(seq), [seq]);
  const bloch = blochVector(state);
  const { p0, p1 } = probabilities(state);

  const amplitudes: Amplitude[] = [
    { basis: "0", real: state[0].re, imag: state[0].im, probability: p0, phase: phase(state[0]) },
    { basis: "1", real: state[1].re, imag: state[1].im, probability: p1, phase: phase(state[1]) },
  ].filter((a) => a.probability > 1e-9);

  const showGates = variant === "gates" || variant === "bloch";
  const showBloch = variant === "bloch" || variant === "gates";
  const showAmps = variant === "amplitudes" || variant === "gates";

  return (
    <div className="my-6 rounded-2xl border border-white/10 bg-quantum-panel/60 p-5">
      <div className="grid md:grid-cols-2 gap-5">
        {showBloch && <BlochSphere vector={bloch} />}

        <div className="flex flex-col gap-4">
          {variant === "superposition" && (
            <div className="rounded-xl bg-black/30 border border-white/10 p-4">
              <p className="text-sm text-gray-300 mb-3">
                Toggle a Hadamard to move between a definite state and an equal superposition.
              </p>
              <div className="flex gap-2">
                <button
                  className="px-3 py-2 rounded bg-quantum-accent/80 hover:bg-quantum-accent text-sm"
                  onClick={() => setSeq([{ name: "h" }])}
                >
                  Apply H → |+⟩
                </button>
                <button
                  className="px-3 py-2 rounded bg-white/10 hover:bg-white/20 text-sm"
                  onClick={() => setSeq([])}
                >
                  Reset → |0⟩
                </button>
              </div>
            </div>
          )}

          <div className="rounded-xl bg-black/30 border border-white/10 p-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">P(0)</span>
              <span className="font-mono text-quantum-accent2">{(p0 * 100).toFixed(1)}%</span>
            </div>
            <div className="h-2 rounded bg-white/10 overflow-hidden mb-3">
              <div className="h-full bg-quantum-accent2" style={{ width: `${p0 * 100}%` }} />
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">P(1)</span>
              <span className="font-mono text-quantum-accent2">{(p1 * 100).toFixed(1)}%</span>
            </div>
            <div className="h-2 rounded bg-white/10 overflow-hidden">
              <div className="h-full bg-quantum-accent" style={{ width: `${p1 * 100}%` }} />
            </div>
          </div>

          {showGates && (
            <div className="rounded-xl bg-black/30 border border-white/10 p-4">
              <p className="text-xs text-gray-400 mb-2">Apply a gate:</p>
              <div className="flex flex-wrap gap-2">
                {GATES.map((g, i) => (
                  <button
                    key={`${g.name}-${i}`}
                    className="px-2.5 py-1.5 rounded bg-white/10 hover:bg-quantum-accent/60 text-sm font-mono"
                    onClick={() => setSeq((s) => [...s, { name: g.name, theta: g.theta }])}
                  >
                    {g.label}
                  </button>
                ))}
                <button
                  className="px-2.5 py-1.5 rounded bg-red-500/30 hover:bg-red-500/50 text-sm"
                  onClick={() => setSeq([])}
                >
                  Reset
                </button>
              </div>
              {seq.length > 0 && (
                <p className="text-xs text-gray-500 mt-3 font-mono">
                  Sequence: {seq.map((g) => g.name.toUpperCase()).join(" · ")}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {showAmps && (
        <div className="mt-4">
          <AmplitudeBars amplitudes={amplitudes} />
        </div>
      )}
    </div>
  );
}

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
  { name: "rx", label: "Rx", theta: Math.PI / 2 },
  { name: "ry", label: "Ry", theta: Math.PI / 2 },
  { name: "rz", label: "Rz", theta: Math.PI / 2 },
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

  const isSuperposition = variant === "superposition";

  return (
    <div className="my-6 card p-4 sm:p-5 animate-pop-in">
      <div className="grid md:grid-cols-2 gap-4 sm:gap-5">
        <div>
          <BlochSphere vector={bloch} />
          <div className="mt-2 grid grid-cols-3 gap-2 text-center text-xs font-mono text-gray-400">
            <span>x {bloch.x.toFixed(2)}</span>
            <span>y {bloch.y.toFixed(2)}</span>
            <span>z {bloch.z.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {isSuperposition ? (
            <div className="card-muted p-4">
              <p className="text-sm text-gray-300 mb-3">
                Toggle a Hadamard to move between a definite state and an equal superposition.
              </p>
              <div className="flex flex-wrap gap-2">
                <button className="btn-primary" onClick={() => setSeq([{ name: "h" }])}>
                  Apply H → |+⟩
                </button>
                <button className="btn-ghost" onClick={() => setSeq([])}>
                  Reset → |0⟩
                </button>
              </div>
            </div>
          ) : (
            <div className="card-muted p-4">
              <p className="text-xs text-gray-400 mb-2">Apply a gate:</p>
              <div className="flex flex-wrap gap-2">
                {GATES.map((g, i) => (
                  <button
                    key={`${g.name}-${i}`}
                    className="gate-btn bg-white/8 text-gray-100 hover:bg-quantum-accent/60"
                    onClick={() => setSeq((s) => [...s, { name: g.name, theta: g.theta }])}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
              <div className="flex gap-2 mt-3">
                <button
                  className="btn-ghost !min-h-0 !py-1.5 text-xs"
                  onClick={() => setSeq((s) => s.slice(0, -1))}
                  disabled={seq.length === 0}
                >
                  ↶ Undo
                </button>
                <button
                  className="btn-ghost !min-h-0 !py-1.5 text-xs"
                  onClick={() => setSeq([])}
                  disabled={seq.length === 0}
                >
                  Reset
                </button>
              </div>
              {seq.length > 0 && (
                <p className="text-xs text-gray-500 mt-3 font-mono break-words">
                  {seq.map((g) => g.name.toUpperCase()).join(" · ")}
                </p>
              )}
            </div>
          )}

          {/* Probabilities */}
          <div className="card-muted p-4">
            <ProbBar label="P(0)" value={p0} color="bg-quantum-accent2" />
            <div className="h-3" />
            <ProbBar label="P(1)" value={p1} color="bg-quantum-accent" />
          </div>
        </div>
      </div>

      <div className="mt-4">
        <AmplitudeBars amplitudes={amplitudes} />
      </div>
    </div>
  );
}

function ProbBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1.5">
        <span className="text-gray-400">{label}</span>
        <span className="font-mono text-gray-200">{(value * 100).toFixed(1)}%</span>
      </div>
      <div className="h-2.5 rounded-full bg-white/10 overflow-hidden">
        <div className={`h-full ${color} transition-all duration-300`} style={{ width: `${value * 100}%` }} />
      </div>
    </div>
  );
}

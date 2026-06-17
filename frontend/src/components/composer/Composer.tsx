import { useState } from "react";
import type { ComposerCircuit, GateOp } from "../../api/types";

const ONE_Q = ["h", "x", "y", "z", "s", "sdg", "t", "tdg", "sx", "id"];
const PARAM_Q = ["rx", "ry", "rz", "p"];
const TWO_Q = ["cx", "cz", "swap"];
const NUM_COLS = 12;

interface Props {
  circuit: ComposerCircuit;
  onChange: (c: ComposerCircuit) => void;
}

export function Composer({ circuit, onChange }: Props) {
  const [activeGate, setActiveGate] = useState<string | null>("h");
  const [angle, setAngle] = useState<string>("pi/2");
  const [pending, setPending] = useState<{ q: number; col: number } | null>(null);

  const opAt = (q: number, col: number): GateOp | undefined =>
    circuit.ops.find((o) => o.column === col && o.qubits.includes(q));

  const parseAngle = (s: string): number => {
    const expr = s.trim().toLowerCase().replace(/pi/g, String(Math.PI));
    try {
      // Only digits, operators, dot, and the substituted pi value remain.
      if (!/^[-+*/(). 0-9]+$/.test(expr)) return Math.PI / 2;
      // eslint-disable-next-line no-new-func
      return Function(`"use strict";return (${expr})`)();
    } catch {
      return Math.PI / 2;
    }
  };

  const setCircuit = (ops: GateOp[]) => onChange({ ...circuit, ops });

  const handleCellClick = (q: number, col: number) => {
    const existing = opAt(q, col);
    if (existing && !pending) {
      // Remove the operation occupying this cell.
      setCircuit(circuit.ops.filter((o) => o !== existing));
      return;
    }
    if (!activeGate) return;

    if (TWO_Q.includes(activeGate)) {
      if (!pending) {
        setPending({ q, col });
        return;
      }
      if (pending.q === q) {
        setPending(null);
        return;
      }
      const op: GateOp = { name: activeGate, qubits: [pending.q, q], column: pending.col };
      setCircuit([...circuit.ops, op]);
      setPending(null);
      return;
    }

    if (activeGate === "measure") {
      const clbits = Math.max(circuit.num_clbits, q + 1);
      onChange({
        ...circuit,
        num_clbits: clbits,
        ops: [...circuit.ops, { name: "measure", qubits: [q], clbit: q, column: col }],
      });
      return;
    }

    const op: GateOp = { name: activeGate, qubits: [q], column: col };
    if (PARAM_Q.includes(activeGate)) op.params = [parseAngle(angle)];
    setCircuit([...circuit.ops, op]);
  };

  const setQubits = (n: number) => {
    const num_qubits = Math.max(1, Math.min(8, n));
    onChange({
      ...circuit,
      num_qubits,
      ops: circuit.ops.filter((o) => o.qubits.every((q) => q < num_qubits)),
    });
  };

  const GateBtn = ({ g }: { g: string }) => (
    <button
      onClick={() => {
        setActiveGate(g);
        setPending(null);
      }}
      className={`px-2.5 py-1.5 rounded text-sm font-mono ${
        activeGate === g ? "bg-quantum-accent text-white" : "bg-white/10 hover:bg-white/20"
      }`}
    >
      {g}
    </button>
  );

  return (
    <div className="rounded-xl border border-white/10 bg-quantum-panel/60 p-4">
      {/* Palette */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {ONE_Q.map((g) => (
          <GateBtn key={g} g={g} />
        ))}
        {PARAM_Q.map((g) => (
          <GateBtn key={g} g={g} />
        ))}
        {TWO_Q.map((g) => (
          <GateBtn key={g} g={g} />
        ))}
        <GateBtn g="measure" />
        <label className="ml-2 text-xs text-gray-400 flex items-center gap-1">
          angle
          <input
            value={angle}
            onChange={(e) => setAngle(e.target.value)}
            className="w-20 bg-black/40 rounded px-2 py-1 text-xs font-mono"
          />
        </label>
      </div>

      {pending && (
        <p className="text-xs text-quantum-accent2 mb-2">
          Two-qubit gate: control set on q{pending.q}. Click another qubit for the target.
        </p>
      )}

      {/* Qubit count */}
      <div className="flex items-center gap-2 mb-3 text-sm">
        <span className="text-gray-400">Qubits:</span>
        <button onClick={() => setQubits(circuit.num_qubits - 1)} className="px-2 bg-white/10 rounded">
          −
        </button>
        <span className="font-mono">{circuit.num_qubits}</span>
        <button onClick={() => setQubits(circuit.num_qubits + 1)} className="px-2 bg-white/10 rounded">
          +
        </button>
        <button
          onClick={() => onChange({ ...circuit, ops: [] })}
          className="ml-3 px-2 py-1 bg-red-500/30 hover:bg-red-500/50 rounded text-xs"
        >
          Clear
        </button>
      </div>

      {/* Grid */}
      <div className="overflow-x-auto">
        <div className="inline-block">
          {Array.from({ length: circuit.num_qubits }).map((_, q) => (
            <div key={q} className="flex items-center">
              <span className="w-10 text-xs font-mono text-gray-500">q{q}</span>
              <div className="flex">
                {Array.from({ length: NUM_COLS }).map((_, col) => {
                  const op = opAt(q, col);
                  const isControl = op && TWO_Q.includes(op.name) && op.qubits[0] === q;
                  const isTarget = op && TWO_Q.includes(op.name) && op.qubits[1] === q;
                  return (
                    <button
                      key={col}
                      onClick={() => handleCellClick(q, col)}
                      className="w-12 h-12 m-0.5 rounded border border-white/5 bg-black/20 hover:border-quantum-accent/60 flex items-center justify-center text-xs font-mono"
                    >
                      {op ? (
                        isControl ? (
                          <span className="w-3 h-3 rounded-full bg-quantum-accent2" />
                        ) : isTarget ? (
                          <span className="text-quantum-accent2">⊕</span>
                        ) : op.name === "measure" ? (
                          <span className="text-quantum-accent2">M</span>
                        ) : (
                          <span className="px-1 py-0.5 rounded bg-quantum-accent/70">
                            {op.name}
                          </span>
                        )
                      ) : (
                        ""
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-2">
        Click a cell to place the selected gate. Click a placed gate to remove it.
      </p>
    </div>
  );
}

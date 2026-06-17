import { useState, type ReactNode } from "react";
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
  const [activeGate, setActiveGate] = useState<string>("h");
  const [angle, setAngle] = useState<string>("pi/2");
  const [pending, setPending] = useState<{ q: number; col: number } | null>(null);

  const opAt = (q: number, col: number): GateOp | undefined =>
    circuit.ops.find((o) => o.column === col && o.qubits.includes(q));

  // Does a two-qubit op in this column span across qubit row `q`? (for the connector line)
  const connectorAt = (q: number, col: number): boolean =>
    circuit.ops.some((o) => {
      if (o.column !== col || !TWO_Q.includes(o.name)) return false;
      const lo = Math.min(...o.qubits);
      const hi = Math.max(...o.qubits);
      return q > lo && q <= hi;
    });

  const parseAngle = (s: string): number => {
    const expr = s.trim().toLowerCase().replace(/pi/g, String(Math.PI));
    try {
      if (!/^[-+*/(). 0-9]+$/.test(expr)) return Math.PI / 2;
      // eslint-disable-next-line no-new-func
      return Function(`"use strict";return (${expr})`)();
    } catch {
      return Math.PI / 2;
    }
  };

  const setOps = (ops: GateOp[]) => onChange({ ...circuit, ops });

  const handleCellClick = (q: number, col: number) => {
    const existing = opAt(q, col);
    if (existing && !pending) {
      setOps(circuit.ops.filter((o) => o !== existing));
      return;
    }
    if (TWO_Q.includes(activeGate)) {
      if (!pending) {
        setPending({ q, col });
        return;
      }
      if (pending.q === q) {
        setPending(null);
        return;
      }
      setOps([...circuit.ops, { name: activeGate, qubits: [pending.q, q], column: pending.col }]);
      setPending(null);
      return;
    }
    if (activeGate === "measure") {
      onChange({
        ...circuit,
        num_clbits: Math.max(circuit.num_clbits, q + 1),
        ops: [...circuit.ops, { name: "measure", qubits: [q], clbit: q, column: col }],
      });
      return;
    }
    const op: GateOp = { name: activeGate, qubits: [q], column: col };
    if (PARAM_Q.includes(activeGate)) op.params = [parseAngle(angle)];
    setOps([...circuit.ops, op]);
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
      className={`gate-btn ${
        activeGate === g
          ? "bg-quantum-accent text-white shadow-glow"
          : "bg-white/8 text-gray-200 hover:bg-white/15"
      }`}
    >
      {g}
    </button>
  );

  const renderToken = (q: number, op: GateOp) => {
    if (TWO_Q.includes(op.name)) {
      const isFirst = op.qubits[0] === q;
      if (op.name === "swap") return <Sym>×</Sym>;
      if (op.name === "cz") return <Dot />;
      // cx: control dot on first, ⊕ on target
      return isFirst ? <Dot /> : <Sym>⊕</Sym>;
    }
    if (op.name === "measure") return <Sym className="text-quantum-accent2">M</Sym>;
    return (
      <span className="px-1.5 py-1 rounded-md bg-quantum-accent/80 text-white text-xs font-mono">
        {op.name}
      </span>
    );
  };

  return (
    <div className="card p-4">
      {/* Palette */}
      <div className="flex flex-wrap items-center gap-1.5 mb-4">
        {[...ONE_Q, ...PARAM_Q, ...TWO_Q, "measure"].map((g) => (
          <GateBtn key={g} g={g} />
        ))}
        <label className="ml-1 text-xs text-gray-400 flex items-center gap-1.5">
          angle
          <input
            value={angle}
            onChange={(e) => setAngle(e.target.value)}
            className="w-20 bg-black/40 border border-white/10 rounded px-2 py-1 text-sm font-mono"
          />
        </label>
      </div>

      {pending && (
        <p className="text-xs text-quantum-accent2 mb-2">
          Two-qubit gate: control set on q{pending.q}. Tap another qubit (same column) for the target.
        </p>
      )}

      {/* Qubit count */}
      <div className="flex items-center gap-2 mb-3 text-sm">
        <span className="text-gray-400">Qubits</span>
        <button onClick={() => setQubits(circuit.num_qubits - 1)} className="btn-ghost !min-h-0 !px-3 !py-1">−</button>
        <span className="font-mono w-5 text-center">{circuit.num_qubits}</span>
        <button onClick={() => setQubits(circuit.num_qubits + 1)} className="btn-ghost !min-h-0 !px-3 !py-1">+</button>
        <button onClick={() => onChange({ ...circuit, ops: [] })} className="btn-danger !min-h-0 !px-3 !py-1 ml-2 text-xs">
          Clear
        </button>
      </div>

      {/* Grid */}
      <div className="overflow-x-auto -mx-1 px-1" style={{ WebkitOverflowScrolling: "touch" }}>
        <div className="inline-block min-w-max">
          {Array.from({ length: circuit.num_qubits }).map((_, q) => (
            <div key={q} className="flex items-center">
              <span className="w-9 shrink-0 text-xs font-mono text-gray-500">q{q}</span>
              <div className="flex relative">
                {/* horizontal qubit wire */}
                <div className="absolute left-0 right-0 top-1/2 h-px bg-white/10" />
                {Array.from({ length: NUM_COLS }).map((_, col) => {
                  const op = opAt(q, col);
                  return (
                    <button
                      key={col}
                      onClick={() => handleCellClick(q, col)}
                      className="relative w-11 h-11 m-0.5 shrink-0 rounded-lg border border-white/5 bg-black/20 hover:border-quantum-accent/60 hover:bg-black/30 flex items-center justify-center transition-colors"
                    >
                      {connectorAt(q, col) && (
                        <span className="absolute left-1/2 -top-1 -translate-x-1/2 w-0.5 h-[calc(100%+0.5rem)] bg-quantum-accent2/70" />
                      )}
                      {op && <span className="relative z-10">{renderToken(q, op)}</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-2">
        Tap a cell to place the selected gate · tap a placed gate to remove it.
      </p>
    </div>
  );
}

function Dot() {
  return <span className="w-3 h-3 rounded-full bg-quantum-accent2" />;
}
function Sym({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <span className={`text-quantum-accent2 text-lg leading-none ${className}`}>{children}</span>;
}

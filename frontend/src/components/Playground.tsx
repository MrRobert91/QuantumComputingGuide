import { useEffect, useState } from "react";
import { api } from "../api/client";
import type { ComposerCircuit, ExecuteResponse } from "../api/types";
import { Composer } from "./composer/Composer";
import { CodeEditor } from "./editor/CodeEditor";
import { ResultPanel } from "./visualizations/ResultPanel";
import { useProgress } from "../store/progress";

const EMPTY: ComposerCircuit = { num_qubits: 2, num_clbits: 0, ops: [] };
const DEFAULT_CODE =
  "from qiskit import QuantumCircuit\n\nqc = QuantumCircuit(2)\nqc.h(0)\nqc.cx(0, 1)\n";

interface Props {
  initialCircuit?: ComposerCircuit;
}

export function Playground({ initialCircuit }: Props) {
  const [tab, setTab] = useState<"composer" | "code">("composer");
  const [circuit, setCircuit] = useState<ComposerCircuit>(initialCircuit ?? EMPTY);
  const [code, setCode] = useState<string>(DEFAULT_CODE);
  const [shots, setShots] = useState(1024);
  const [result, setResult] = useState<ExecuteResponse | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { preferredMode, setMode } = useProgress();
  const [ibmEnabled, setIbmEnabled] = useState(false);

  useEffect(() => {
    api.backends().then((b) => setIbmEnabled(b.ibm_enabled)).catch(() => {});
  }, []);

  const run = async () => {
    setBusy(true);
    setError(null);
    try {
      const res =
        tab === "composer"
          ? await api.executeComposer(circuit, shots, preferredMode)
          : await api.executeCode(code, shots, preferredMode);
      setResult(res);
      if (res.generated_code && tab === "composer") setCode(res.generated_code);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const generateCode = async () => {
    setError(null);
    try {
      const res = await api.toCode(circuit);
      if (res.code) {
        setCode(res.code);
        setTab("code");
      }
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const renderCircuit = async () => {
    setError(null);
    try {
      const res = await api.fromCode(code);
      if (res.composer) {
        setCircuit(res.composer);
        setTab("composer");
      }
    } catch (e) {
      setError((e as Error).message);
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-5 lg:gap-6">
      <div>
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {/* Segmented tabs */}
          <div className="inline-flex rounded-lg bg-black/30 border border-white/10 p-1">
            <button
              onClick={() => setTab("composer")}
              className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                tab === "composer" ? "bg-quantum-accent text-white" : "text-gray-300 hover:text-white"
              }`}
            >
              Composer
            </button>
            <button
              onClick={() => setTab("code")}
              className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                tab === "code" ? "bg-quantum-accent text-white" : "text-gray-300 hover:text-white"
              }`}
            >
              Code
            </button>
          </div>

          <div className="ml-auto">
            {tab === "composer" ? (
              <button onClick={generateCode} className="btn-ghost !min-h-0 !py-1.5 text-sm">
                Generate code →
              </button>
            ) : (
              <button onClick={renderCircuit} className="btn-ghost !min-h-0 !py-1.5 text-sm">
                ← Render circuit
              </button>
            )}
          </div>
        </div>

        {tab === "composer" ? (
          <Composer circuit={circuit} onChange={setCircuit} />
        ) : (
          <CodeEditor value={code} onChange={setCode} />
        )}

        <div className="flex flex-wrap items-center gap-3 mt-4">
          <button onClick={run} disabled={busy} className="btn-accent">
            {busy ? "Running…" : "▶ Run"}
          </button>

          <label className="text-sm text-gray-400 flex items-center gap-2">
            shots
            <input
              type="number"
              min={1}
              value={shots}
              onChange={(e) => setShots(Number(e.target.value))}
              className="w-24 bg-black/40 border border-white/10 rounded px-2 py-1.5 text-sm"
            />
          </label>

          <label className="text-sm text-gray-400 flex items-center gap-2">
            mode
            <select
              value={preferredMode}
              onChange={(e) => setMode(e.target.value)}
              className="bg-black/40 border border-white/10 rounded px-2 py-1.5 text-sm"
            >
              <option value="aer">Aer (local)</option>
              <option value="ibm" disabled={!ibmEnabled}>
                IBM Quantum {ibmEnabled ? "" : "(set token)"}
              </option>
            </select>
          </label>
        </div>

        {error && (
          <p className="text-sm text-red-300 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 mt-3">
            {error}
          </p>
        )}
      </div>

      <div>
        {result ? (
          <ResultPanel result={result} />
        ) : (
          <div className="rounded-2xl border border-dashed border-white/15 p-8 text-center text-gray-500">
            Build a circuit and press <span className="text-quantum-accent2 font-medium">Run</span> to
            see measurement counts, amplitudes, and Bloch spheres.
          </div>
        )}
      </div>
    </div>
  );
}

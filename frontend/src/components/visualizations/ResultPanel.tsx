import type { ExecuteResponse } from "../../api/types";
import { BlochSphere } from "./BlochSphere";
import { Histogram } from "./Histogram";
import { AmplitudeBars } from "./AmplitudeBars";

export function ResultPanel({ result }: { result: ExecuteResponse }) {
  return (
    <div className="space-y-4 animate-fade-in">
      {result.warnings.map((w, i) => (
        <p key={i} className="text-xs text-amber-300 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2">
          ⚠ {w}
        </p>
      ))}

      <p className="text-xs text-gray-500">
        Executed on <span className="chip ml-1">{result.mode}</span>
      </p>

      {result.counts && <Histogram counts={result.counts} />}

      {result.amplitudes && result.amplitudes.length > 0 && (
        <AmplitudeBars amplitudes={result.amplitudes} />
      )}

      {result.bloch && result.bloch.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-300 mb-2">Bloch spheres (per qubit)</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {result.bloch.map((b) => (
              <div key={b.qubit} className="card-muted p-2">
                <p className="text-xs text-gray-500 mb-1 px-1">q{b.qubit}</p>
                <BlochSphere vector={b} size={220} />
              </div>
            ))}
          </div>
        </div>
      )}

      {result.diagram && (
        <div>
          <h4 className="text-sm font-semibold text-gray-300 mb-2">Circuit diagram</h4>
          <pre className="card-muted p-4 overflow-x-auto text-xs text-gray-200 leading-5">
            {result.diagram}
          </pre>
        </div>
      )}
    </div>
  );
}

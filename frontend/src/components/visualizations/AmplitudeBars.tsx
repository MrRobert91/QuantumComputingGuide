import type { Amplitude } from "../../api/types";

interface Props {
  amplitudes: Amplitude[];
}

// Hue encodes the complex phase so users can see phase differences at a glance.
function phaseColor(phase: number): string {
  const deg = ((phase * 180) / Math.PI + 360) % 360;
  return `hsl(${deg}, 80%, 60%)`;
}

export function AmplitudeBars({ amplitudes }: Props) {
  const max = Math.max(...amplitudes.map((a) => a.probability), 1e-9);
  return (
    <div className="rounded-xl bg-black/30 border border-white/10 p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-gray-300">Statevector amplitudes</h4>
        <span className="text-xs text-gray-500">bar = probability · color = phase</span>
      </div>
      <div className="flex items-end gap-3 h-44">
        {amplitudes.map((a) => (
          <div key={a.basis} className="flex flex-col items-center flex-1 min-w-[2.5rem]">
            <span className="text-xs text-gray-400 mb-1">
              {(a.probability * 100).toFixed(0)}%
            </span>
            <div className="w-full flex items-end h-full">
              <div
                className="w-full rounded-t"
                style={{
                  height: `${(a.probability / max) * 100}%`,
                  backgroundColor: phaseColor(a.phase),
                }}
                title={`amplitude ${a.real.toFixed(3)} ${a.imag >= 0 ? "+" : "-"} ${Math.abs(
                  a.imag
                ).toFixed(3)}i · phase ${(a.phase).toFixed(2)} rad`}
              />
            </div>
            <span className="text-xs font-mono text-gray-400 mt-2">|{a.basis}⟩</span>
          </div>
        ))}
      </div>
    </div>
  );
}

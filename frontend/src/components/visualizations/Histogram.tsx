interface Props {
  counts: Record<string, number>;
  title?: string;
}

// Simple SVG bar chart for measurement counts (a plot_histogram analogue).
export function Histogram({ counts, title = "Measurement counts" }: Props) {
  const entries = Object.entries(counts).sort(([a], [b]) => a.localeCompare(b));
  const total = entries.reduce((s, [, v]) => s + v, 0) || 1;
  const max = Math.max(...entries.map(([, v]) => v), 1);

  return (
    <div className="rounded-xl bg-black/30 border border-white/10 p-4">
      <h4 className="text-sm font-semibold text-gray-300 mb-3">{title}</h4>
      <div className="flex items-end gap-3 h-48">
        {entries.map(([label, value]) => {
          const heightPct = (value / max) * 100;
          const prob = ((value / total) * 100).toFixed(1);
          return (
            <div key={label} className="flex flex-col items-center flex-1 min-w-[2rem]">
              <span className="text-xs text-quantum-accent2 mb-1">{prob}%</span>
              <div className="w-full flex items-end h-full">
                <div
                  className="w-full bg-gradient-to-t from-quantum-accent to-quantum-accent2 rounded-t"
                  style={{ height: `${heightPct}%` }}
                  title={`${value} shots`}
                />
              </div>
              <span className="text-xs font-mono text-gray-400 mt-2">{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

import { Link } from "react-router-dom";
import { allLessons, curriculum } from "../data/curriculum";
import { useProgress } from "../store/progress";

export function Home() {
  const { completedLessons } = useProgress();
  const done = allLessons.filter((l) => completedLessons[l.id]).length;
  const pct = Math.round((done / allLessons.length) * 100);

  return (
    <div>
      <h1 className="text-4xl font-bold text-white mb-2">
        Prepare for the Qiskit v2.x Developer Certification
      </h1>
      <p className="text-gray-400 max-w-2xl mb-6">
        Learn the theory, build and run quantum circuits, and explore interactive visualizations of
        quantum concepts — all aligned with IBM's{" "}
        <a
          href="https://www.ibm.com/quantum/blog/qiskit-v2x-developer-certification"
          className="text-quantum-accent underline"
          target="_blank"
          rel="noreferrer"
        >
          Qiskit v2.x Developer — Associate
        </a>{" "}
        exam objectives.
      </p>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <Link to="/playground" className="rounded-xl bg-quantum-panel/60 border border-white/10 p-5 hover:border-quantum-accent/60">
          <div className="text-2xl mb-2">🧪</div>
          <h3 className="font-semibold text-white">Playground</h3>
          <p className="text-sm text-gray-400">Compose or code circuits and run them on the simulator.</p>
        </Link>
        <Link to="/exercises" className="rounded-xl bg-quantum-panel/60 border border-white/10 p-5 hover:border-quantum-accent/60">
          <div className="text-2xl mb-2">✅</div>
          <h3 className="font-semibold text-white">Exercises</h3>
          <p className="text-sm text-gray-400">Solve circuit challenges with instant validation.</p>
        </Link>
        <Link to="/exam" className="rounded-xl bg-quantum-panel/60 border border-white/10 p-5 hover:border-quantum-accent/60">
          <div className="text-2xl mb-2">📝</div>
          <h3 className="font-semibold text-white">Mock exam</h3>
          <p className="text-sm text-gray-400">Test yourself with sample multiple-choice questions.</p>
        </Link>
      </div>

      <div className="rounded-xl bg-quantum-panel/60 border border-white/10 p-5 mb-8">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-300 font-semibold">Your progress</span>
          <span className="text-quantum-accent2">
            {done}/{allLessons.length} lessons · {pct}%
          </span>
        </div>
        <div className="h-2 rounded bg-white/10 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-quantum-accent to-quantum-accent2" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <h2 className="text-2xl font-semibold text-white mb-4">Curriculum</h2>
      <div className="space-y-3">
        {curriculum.map((m) => (
          <div key={m.id} className="rounded-xl bg-quantum-panel/40 border border-white/10 p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-white">{m.title}</h3>
              {m.examWeight && (
                <span className="text-xs px-2 py-0.5 rounded bg-quantum-accent/20 text-quantum-accent2">
                  {m.examWeight}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-400 mt-1 mb-3">{m.summary}</p>
            <div className="flex flex-wrap gap-2">
              {m.lessons.map((l) => (
                <Link
                  key={l.id}
                  to={`/lesson/${l.id}`}
                  className="text-xs px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-gray-300"
                >
                  {completedLessons[l.id] ? "✓ " : ""}
                  {l.title}
                  {l.status === "scaffold" && <span className="text-gray-600"> · soon</span>}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-600 mt-10">
        Educational content is original and links to IBM's open materials (Qiskit docs, IBM Quantum
        Learning). Qiskit and IBM Quantum are trademarks of IBM. This project is not affiliated with
        or endorsed by IBM.
      </p>
    </div>
  );
}

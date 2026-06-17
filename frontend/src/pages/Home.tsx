import { Link } from "react-router-dom";
import { allLessons, curriculum } from "../data/curriculum";
import { useProgress } from "../store/progress";

export function Home() {
  const { completedLessons } = useProgress();
  const done = allLessons.filter((l) => completedLessons[l.id]).length;
  const pct = Math.round((done / allLessons.length) * 100);

  return (
    <div>
      <div className="mb-8">
        <span className="chip mb-4">IBM Qiskit v2.x · C1000-179</span>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-3 mt-3 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          Prepare for the Qiskit v2.x Developer Certification
        </h1>
        <p className="text-gray-400 max-w-2xl text-[15px] leading-7">
          Learn the theory, build and run quantum circuits, and explore interactive visualizations of
          quantum concepts — all aligned with IBM's{" "}
          <a
            href="https://www.ibm.com/quantum/blog/qiskit-v2x-developer-certification"
            className="text-quantum-accent underline underline-offset-2"
            target="_blank"
            rel="noreferrer"
          >
            Qiskit v2.x Developer — Associate
          </a>{" "}
          exam objectives.
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {[
          { to: "/playground", icon: "🧪", title: "Playground", desc: "Compose or code circuits and run them on the simulator." },
          { to: "/exercises", icon: "✅", title: "Exercises", desc: "Solve circuit challenges with instant validation." },
          { to: "/exam", icon: "📝", title: "Mock exam", desc: "Test yourself with sample multiple-choice questions." },
        ].map((c) => (
          <Link key={c.to} to={c.to} className="card p-5 hover:border-quantum-accent/50 hover:shadow-glow transition-all">
            <div className="text-2xl mb-2">{c.icon}</div>
            <h3 className="font-semibold text-white">{c.title}</h3>
            <p className="text-sm text-gray-400 mt-0.5">{c.desc}</p>
          </Link>
        ))}
      </div>

      <div className="card p-5 mb-8">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-200 font-semibold">Your progress</span>
          <span className="text-quantum-accent2 font-mono">
            {done}/{allLessons.length} · {pct}%
          </span>
        </div>
        <div className="h-2.5 rounded-full bg-white/10 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-quantum-accent to-quantum-accent2 transition-all duration-500" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4">Curriculum</h2>
      <div className="space-y-3">
        {curriculum.map((m) => (
          <div key={m.id} className="card p-4 sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-semibold text-white">{m.title}</h3>
              {m.examWeight && <span className="chip shrink-0">{m.examWeight}</span>}
            </div>
            <p className="text-sm text-gray-400 mt-1 mb-3">{m.summary}</p>
            <div className="flex flex-wrap gap-2">
              {m.lessons.map((l) => (
                <Link
                  key={l.id}
                  to={`/lesson/${l.id}`}
                  className="text-xs px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 transition-colors"
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

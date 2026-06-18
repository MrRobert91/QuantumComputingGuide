import { Link } from "react-router-dom";
import { allLessons, curriculum } from "../data/curriculum";
import { useProgress } from "../store/progress";

const ACTIONS = [
  {
    to: "/playground",
    icon: "🧪",
    title: "Playground",
    desc: "Compose or code circuits and run them on the simulator.",
    ring: "from-quantum-accent/30 to-quantum-accent/5",
  },
  {
    to: "/exercises",
    icon: "✅",
    title: "Exercises",
    desc: "Solve circuit challenges with instant validation.",
    ring: "from-quantum-accent2/30 to-quantum-accent2/5",
  },
  {
    to: "/exam",
    icon: "📝",
    title: "Mock exam",
    desc: "Test yourself with sample multiple-choice questions.",
    ring: "from-quantum-accent3/30 to-quantum-accent3/5",
  },
];

export function Home() {
  const { completedLessons } = useProgress();
  const done = allLessons.filter((l) => completedLessons[l.id]).length;
  const pct = Math.round((done / allLessons.length) * 100);

  return (
    <div className="animate-rise-in">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-transparent p-5 sm:p-8 mb-6 sm:mb-8">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 -right-16 h-56 w-56 rounded-full bg-quantum-accent/20 blur-3xl animate-glow-pulse"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-28 -left-12 h-56 w-56 rounded-full bg-quantum-accent2/15 blur-3xl"
        />
        <div className="relative">
          <span className="chip mb-4">IBM Qiskit v2.x · C1000-179</span>
          <h1 className="text-[28px] leading-tight sm:text-5xl font-bold tracking-tight text-gradient mb-3">
            Prepare for the Qiskit v2.x Developer Certification
          </h1>
          <p className="text-gray-400 max-w-2xl text-[15px] sm:text-base leading-7">
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
          <div className="flex flex-wrap gap-3 mt-6">
            <Link to="/playground" className="btn-accent">
              🧪 Open Playground
            </Link>
            <Link to={`/lesson/${allLessons[0]?.id ?? ""}`} className="btn-ghost">
              Start learning →
            </Link>
          </div>
        </div>
      </section>

      {/* Quick actions */}
      <div className="grid sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {ACTIONS.map((c) => (
          <Link
            key={c.to}
            to={c.to}
            className="card p-4 sm:p-5 flex items-center sm:items-start sm:flex-col gap-4 sm:gap-0 hover:border-quantum-accent/50 hover:shadow-glow transition-all active:scale-[0.99]"
          >
            <div
              className={`grid place-items-center shrink-0 h-12 w-12 rounded-2xl text-2xl bg-gradient-to-br ${c.ring} border border-white/10 sm:mb-3`}
            >
              {c.icon}
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-white">{c.title}</h3>
              <p className="text-sm text-gray-400 mt-0.5">{c.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Progress */}
      <div className="card p-5 mb-6 sm:mb-8">
        <div className="flex items-end justify-between mb-3">
          <div>
            <p className="text-gray-200 font-semibold">Your progress</p>
            <p className="text-xs text-gray-500 mt-0.5">{done} of {allLessons.length} lessons completed</p>
          </div>
          <span className="text-2xl font-bold font-mono text-gradient">{pct}%</span>
        </div>
        <div className="h-3 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-quantum-accent to-quantum-accent2 transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Curriculum */}
      <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4 flex items-center gap-2">
        <span className="h-5 w-1 rounded-full bg-gradient-to-b from-quantum-accent to-quantum-accent2" />
        Curriculum
      </h2>
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
                  className={`inline-flex items-center gap-1.5 text-[13px] px-3 py-2 rounded-xl border transition-colors ${
                    completedLessons[l.id]
                      ? "bg-quantum-accent2/10 border-quantum-accent2/30 text-quantum-accent2"
                      : "bg-white/5 border-white/10 hover:bg-white/10 text-gray-300"
                  }`}
                >
                  {completedLessons[l.id] && <span>✓</span>}
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

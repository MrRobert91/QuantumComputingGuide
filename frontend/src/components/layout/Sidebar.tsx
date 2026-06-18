import { NavLink } from "react-router-dom";
import { allLessons, curriculum } from "../../data/curriculum";
import { useProgress } from "../../store/progress";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: Props) {
  const { completedLessons } = useProgress();
  const done = allLessons.filter((l) => completedLessons[l.id]).length;
  const pct = Math.round((done / allLessons.length) * 100);

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-[86%] max-w-[20rem] overflow-y-auto pt-safe pb-safe
                  border-r border-white/10 bg-quantum-panel/95 backdrop-blur-xl
                  transition-transform duration-300 ease-out
                  lg:static lg:z-auto lg:w-72 lg:max-w-none lg:translate-x-0 lg:bg-quantum-panel/40
                  ${open ? "translate-x-0 animate-slide-in" : "-translate-x-full"}`}
    >
      <div className="p-4 sm:p-5">
        <div className="flex items-center justify-between mb-4">
          <NavLink to="/" className="flex items-center gap-2.5 text-lg font-bold text-white tracking-tight">
            <span className="grid place-items-center h-9 w-9 rounded-xl bg-gradient-to-br from-quantum-accent to-quantum-accent2 text-white shadow-glow">
              ⚛
            </span>
            <span className="leading-tight">
              Qiskit Cert Prep
              <span className="block text-[11px] font-normal text-gray-500">v2.x Developer · Associate</span>
            </span>
          </NavLink>
          <button
            aria-label="Close menu"
            onClick={onClose}
            className="lg:hidden grid place-items-center h-9 w-9 rounded-xl bg-white/[0.06] border border-white/10 text-gray-300 active:scale-95"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        {/* Progress summary */}
        <div className="card-muted p-3 mb-5">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-gray-400 font-medium">Overall progress</span>
            <span className="font-mono text-quantum-accent2">{pct}%</span>
          </div>
          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-quantum-accent to-quantum-accent2 transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        <nav className="space-y-1 mb-6">
          <NavLink to="/playground" className={navClass}>
            <span className="text-base">🧪</span> Playground
          </NavLink>
          <NavLink to="/exercises" className={navClass}>
            <span className="text-base">✅</span> Exercises
          </NavLink>
          <NavLink to="/exam" className={navClass}>
            <span className="text-base">📝</span> Mock exam
          </NavLink>
        </nav>

        <p className="text-[11px] uppercase tracking-widest text-gray-600 mb-2 px-2">Curriculum</p>
        {curriculum.map((m) => (
          <div key={m.id} className="mb-3">
            <p className="text-xs font-semibold text-gray-300 mb-1 px-2">{m.title}</p>
            <div className="space-y-0.5">
              {m.lessons.map((l) => (
                <NavLink key={l.id} to={`/lesson/${l.id}`} className={navClass}>
                  <span className="flex items-center justify-between gap-2 w-full">
                    <span className="truncate">{l.title}</span>
                    {completedLessons[l.id] && <span className="text-quantum-accent2 text-xs shrink-0">✓</span>}
                  </span>
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}

function navClass({ isActive }: { isActive: boolean }) {
  return `flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[15px] text-gray-400 hover:bg-white/5 hover:text-white transition-colors ${
    isActive ? "bg-quantum-accent/15 text-white ring-1 ring-quantum-accent/30" : ""
  }`;
}

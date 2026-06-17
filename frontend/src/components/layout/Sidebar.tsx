import { NavLink } from "react-router-dom";
import { curriculum } from "../../data/curriculum";
import { useProgress } from "../../store/progress";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: Props) {
  const { completedLessons } = useProgress();

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-[80%] max-w-xs overflow-y-auto border-r border-white/10
                  bg-quantum-panel/95 backdrop-blur-md transition-transform duration-300 ease-out
                  lg:static lg:z-auto lg:w-72 lg:max-w-none lg:translate-x-0 lg:bg-quantum-panel/40
                  ${open ? "translate-x-0 animate-slide-in" : "-translate-x-full"}`}
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-1">
          <NavLink to="/" className="flex items-center gap-2 text-lg font-bold text-white tracking-tight">
            <span className="text-quantum-accent2">⚛</span> Qiskit Cert Prep
          </NavLink>
          <button
            aria-label="Close menu"
            onClick={onClose}
            className="lg:hidden btn-ghost !min-h-0 !px-2 !py-1.5"
          >
            ✕
          </button>
        </div>
        <p className="text-xs text-gray-500 mb-5">v2.x Developer — Associate</p>

        <nav className="space-y-1 text-sm mb-6">
          <NavLink to="/playground" className={navClass}>🧪 Playground</NavLink>
          <NavLink to="/exercises" className={navClass}>✅ Exercises</NavLink>
          <NavLink to="/exam" className={navClass}>📝 Mock exam</NavLink>
        </nav>

        <p className="text-[11px] uppercase tracking-widest text-gray-600 mb-2 px-2">Curriculum</p>
        {curriculum.map((m) => (
          <div key={m.id} className="mb-3">
            <p className="text-xs font-semibold text-gray-300 mb-1 px-2">{m.title}</p>
            <div className="space-y-0.5">
              {m.lessons.map((l) => (
                <NavLink key={l.id} to={`/lesson/${l.id}`} className={navClass}>
                  <span className="flex items-center justify-between gap-2">
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
  return `block px-2.5 py-2 rounded-lg text-gray-400 hover:bg-white/5 hover:text-white transition-colors ${
    isActive ? "bg-quantum-accent/15 text-white ring-1 ring-quantum-accent/30" : ""
  }`;
}

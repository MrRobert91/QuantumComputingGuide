import { NavLink } from "react-router-dom";
import { curriculum } from "../../data/curriculum";
import { useProgress } from "../../store/progress";

export function Sidebar() {
  const { completedLessons } = useProgress();

  return (
    <aside className="w-72 shrink-0 border-r border-white/10 bg-quantum-panel/40 overflow-y-auto h-full">
      <div className="p-4">
        <NavLink to="/" className="block text-lg font-bold text-white mb-1">
          ⚛ Qiskit Cert Prep
        </NavLink>
        <p className="text-xs text-gray-500 mb-4">v2.x Developer — Associate</p>

        <nav className="space-y-1 text-sm mb-6">
          <NavLink to="/playground" className={navClass}>
            🧪 Playground
          </NavLink>
          <NavLink to="/exercises" className={navClass}>
            ✅ Exercises
          </NavLink>
          <NavLink to="/exam" className={navClass}>
            📝 Mock exam
          </NavLink>
        </nav>

        <p className="text-xs uppercase tracking-wide text-gray-600 mb-2">Curriculum</p>
        {curriculum.map((m) => (
          <div key={m.id} className="mb-3">
            <p className="text-xs font-semibold text-gray-300 mb-1">{m.title}</p>
            <div className="space-y-0.5">
              {m.lessons.map((l) => (
                <NavLink key={l.id} to={`/lesson/${l.id}`} className={navClass}>
                  <span className="flex items-center justify-between gap-2">
                    <span className="truncate">{l.title}</span>
                    {completedLessons[l.id] && <span className="text-green-400 text-xs">✓</span>}
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
  return `block px-2 py-1.5 rounded text-gray-400 hover:bg-white/5 hover:text-white ${
    isActive ? "bg-quantum-accent/20 text-white" : ""
  }`;
}

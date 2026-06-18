import { useEffect, useState, type ReactNode } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll while the drawer is open on mobile.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="lg:flex lg:h-screen lg:overflow-hidden">
      {/* Mobile top bar */}
      <header className="lg:hidden sticky top-0 z-30 pt-safe border-b border-white/10 bg-quantum-bg/80 backdrop-blur-xl">
        <div className="flex items-center gap-3 px-4 h-14">
          <button
            aria-label="Open curriculum menu"
            onClick={() => setOpen(true)}
            className="grid place-items-center h-10 w-10 -ml-1.5 rounded-xl bg-white/[0.06] border border-white/10 text-gray-200 active:scale-95 transition-transform"
          >
            <MenuIcon />
          </button>
          <Link to="/" className="flex items-center gap-2 font-semibold text-white tracking-tight">
            <LogoMark />
            <span>Qiskit Cert Prep</span>
          </Link>
        </div>
      </header>

      {/* Backdrop */}
      {open && (
        <div
          aria-hidden
          onClick={() => setOpen(false)}
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm animate-fade-in"
        />
      )}

      <Sidebar open={open} onClose={() => setOpen(false)} />

      <main className="flex-1 lg:overflow-y-auto">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 pb-28 lg:pb-12">{children}</div>
      </main>

      {/* Mobile bottom navigation — thumb-reachable primary nav */}
      <nav className="lg:hidden fixed inset-x-0 bottom-0 z-30 pb-safe border-t border-white/10 bg-quantum-bg/85 backdrop-blur-xl shadow-nav">
        <div className="flex items-stretch gap-1 px-2 pt-1.5">
          <BottomTab to="/" end label="Learn" icon={<HomeIcon />} />
          <BottomTab to="/playground" label="Playground" icon={<FlaskIcon />} />
          <BottomTab to="/exercises" label="Exercises" icon={<CheckIcon />} />
          <BottomTab to="/exam" label="Exam" icon={<ExamIcon />} />
        </div>
      </nav>
    </div>
  );
}

function BottomTab({
  to,
  label,
  icon,
  end,
}: {
  to: string;
  label: string;
  icon: ReactNode;
  end?: boolean;
}) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) => `tab-item ${isActive ? "tab-item-active" : ""}`}
    >
      {({ isActive }) => (
        <>
          <span
            className={`grid place-items-center transition-all duration-200 ${
              isActive ? "text-quantum-accent2 -translate-y-px drop-shadow-[0_0_8px_rgba(45,212,191,0.5)]" : ""
            }`}
          >
            {icon}
          </span>
          <span>{label}</span>
        </>
      )}
    </NavLink>
  );
}

function LogoMark() {
  return (
    <span className="grid place-items-center h-7 w-7 rounded-lg bg-gradient-to-br from-quantum-accent to-quantum-accent2 text-white text-sm shadow-glow">
      ⚛
    </span>
  );
}

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M3 6h18M3 12h18M3 18h18" />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 10.5 12 4l9 6.5" />
      <path d="M5 9.5V20h14V9.5" />
    </svg>
  );
}

function FlaskIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 3h6M10 3v6.5L5 18a2 2 0 0 0 1.8 3h10.4A2 2 0 0 0 19 18l-5-8.5V3" />
      <path d="M7.5 14h9" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3.5 12.5l5 5 12-12" />
    </svg>
  );
}

function ExamIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M9 8h6M9 12h6M9 16h4" />
    </svg>
  );
}

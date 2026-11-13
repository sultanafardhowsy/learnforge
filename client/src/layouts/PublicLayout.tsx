import { useState, type FormEvent } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { LayoutDashboard, Menu, Search, X } from "lucide-react";
import { Logo } from "../components/Logo";
import { useAuth } from "../context/AuthContext";

/** Remounted (via `key`) whenever the URL query changes, so it always shows the current term. */
function SearchBox({ className = "", onDone }: { className?: string; onDone?: () => void }) {
  const [params] = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");
  const navigate = useNavigate();

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const term = q.trim();
    navigate(term ? `/?q=${encodeURIComponent(term)}#courses` : "/#courses");
    onDone?.();
  };

  return (
    <form onSubmit={submit} role="search" className={`relative ${className}`}>
      <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted" />
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search for anything"
        aria-label="Search courses"
        className="w-full rounded-full border border-ink-soft/80 bg-paper py-2.5 pr-4 pl-11 text-sm placeholder:text-muted focus:border-brand-600 focus:bg-white focus:ring-2 focus:ring-brand-600/20 focus:outline-none"
      />
    </form>
  );
}

function Navbar() {
  const { admin } = useAuth();
  const { pathname } = useLocation();
  const [params] = useSearchParams();
  const q = params.get("q") ?? "";
  // The mobile menu is tied to the page it was opened on, so it closes on navigation.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const setOpen = (fn: (o: boolean) => boolean) => setOpenOn(fn(open) ? pathname : null);

  const navLink = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors hover:text-brand-700 ${isActive ? "text-brand-700" : "text-ink-soft"}`;

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 shadow-[0_2px_4px_rgba(0,0,0,0.04)] backdrop-blur">
      <div className="container-page flex h-16 items-center gap-4 lg:gap-8">
        <Logo />
        <nav className="hidden md:block">
          <NavLink to="/" end className={navLink}>
            Courses
          </NavLink>
        </nav>
        <SearchBox key={q} className="hidden flex-1 md:block" />
        <div className="ml-auto hidden items-center gap-2 md:flex">
          {admin ? (
            <Link to="/admin" className="btn-dark">
              <LayoutDashboard className="size-4" /> Dashboard
            </Link>
          ) : (
            <Link to="/admin/login" className="btn-outline">
              Admin login
            </Link>
          )}
        </div>
        <button
          className="btn-ghost ml-auto p-2 md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-line bg-white md:hidden">
          <div className="container-page space-y-4 py-4">
            <SearchBox key={q} onDone={() => setOpenOn(null)} />
            <nav className="flex flex-col gap-3">
              <NavLink to="/" end className={navLink}>
                All courses
              </NavLink>
            </nav>
            {admin ? (
              <Link to="/admin" className="btn-dark w-full">
                <LayoutDashboard className="size-4" /> Admin dashboard
              </Link>
            ) : (
              <Link to="/admin/login" className="btn-outline w-full">
                Admin login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

const YEAR = new Date().getFullYear();

function Footer() {
  return (
    <footer className="mt-auto bg-ink text-white">
      <div className="container-page flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Logo light />
          <p className="mt-2 max-w-xs text-sm text-white/60">
            Learn practical skills from hands-on video courses.
          </p>
        </div>
        <nav className="flex gap-6 text-sm text-white/80">
          <Link to="/" className="hover:text-white">
            Courses
          </Link>
          <Link to="/admin" className="hover:text-white">
            Admin
          </Link>
        </nav>
      </div>
      <div className="border-t border-white/10">
        <p className="container-page py-4 text-xs text-white/50">
          © {YEAR} LearnForge. Built as a simplified LMS.
        </p>
      </div>
    </footer>
  );
}

export function PublicLayout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

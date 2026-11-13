import { Link, NavLink, Navigate, Outlet, useLocation } from "react-router-dom";
import { ExternalLink, LayoutGrid, LogOut } from "lucide-react";
import { Logo } from "../components/Logo";
import { LoadingState } from "../components/ui/States";
import { useAuth } from "../context/AuthContext";

/** Guards every /admin route except the login page. */
export function AdminLayout() {
  const { admin, checking, logout } = useAuth();
  const location = useLocation();

  if (checking) return <LoadingState label="Checking your session…" />;
  if (!admin) return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;

  const link = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
      isActive ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/5 hover:text-white"
    }`;

  return (
    <div className="flex min-h-dvh flex-col bg-paper lg:flex-row">
      <aside className="bg-ink text-white lg:sticky lg:top-0 lg:flex lg:h-dvh lg:w-64 lg:shrink-0 lg:flex-col">
        <div className="flex h-16 items-center justify-between px-4 lg:px-5">
          <Logo to="/admin" light />
          <button onClick={logout} className="btn p-2 text-white/80 hover:bg-white/10 lg:hidden" aria-label="Log out">
            <LogOut className="size-5" />
          </button>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-1 lg:flex-col lg:pb-0">
          <NavLink to="/admin" end className={link}>
            <LayoutGrid className="size-4" /> Courses
          </NavLink>
          <Link to="/" className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-white/70 hover:bg-white/5 hover:text-white">
            <ExternalLink className="size-4" /> View student site
          </Link>
        </nav>
        <div className="hidden border-t border-white/10 p-4 lg:block">
          <p className="truncate text-sm font-semibold">{admin.name}</p>
          <p className="truncate text-xs text-white/60">{admin.email}</p>
          <button onClick={logout} className="btn mt-3 w-full border border-white/20 text-white hover:bg-white/10">
            <LogOut className="size-4" /> Log out
          </button>
        </div>
      </aside>
      <main className="min-w-0 flex-1">
        <Outlet />
      </main>
    </div>
  );
}

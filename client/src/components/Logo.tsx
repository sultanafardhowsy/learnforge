import { Link } from "react-router-dom";

export function Logo({ to = "/", light = false }: { to?: string; light?: boolean }) {
  return (
    <Link to={to} className="flex items-center gap-2" aria-label="LearnForge home">
      <svg viewBox="0 0 32 32" className="size-8 shrink-0" aria-hidden>
        <rect width="32" height="32" rx="7" fill="#5b21b6" />
        <path d="M9 22V10h3v9.5h7V22z" fill="#fff" />
        <circle cx="22.5" cy="11.5" r="2.5" fill="#fbbf24" />
      </svg>
      <span className={`font-serif text-xl font-bold tracking-tight ${light ? "text-white" : "text-ink"}`}>
        LearnForge
      </span>
    </Link>
  );
}

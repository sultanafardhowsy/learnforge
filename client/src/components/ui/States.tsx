import type { ReactNode } from "react";
import { AlertTriangle, Inbox, Loader2, RotateCw } from "lucide-react";

export function Spinner({ className = "size-5" }: { className?: string }) {
  return <Loader2 className={`${className} animate-spin`} aria-hidden />;
}

export function LoadingState({ label = "Loading…" }: { label?: string }) {
  return (
    <div role="status" className="flex flex-col items-center justify-center gap-3 py-20 text-muted">
      <Spinner className="size-7 text-brand-700" />
      <p className="text-sm">{label}</p>
    </div>
  );
}

export function EmptyState({
  title,
  message,
  action,
  icon,
}: {
  title: string;
  message?: string;
  action?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-line bg-paper px-6 py-16 text-center">
      <div className="mb-4 grid size-12 place-items-center rounded-full bg-white text-muted shadow-sm">
        {icon ?? <Inbox className="size-6" />}
      </div>
      <h3 className="font-sans text-base font-bold text-ink">{title}</h3>
      {message && <p className="mt-1 max-w-sm text-sm text-muted">{message}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function ErrorState({
  title = "Something went wrong",
  message,
  onRetry,
}: {
  title?: string;
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center rounded-lg border border-red-200 bg-red-50 px-6 py-14 text-center"
    >
      <div className="mb-4 grid size-12 place-items-center rounded-full bg-white text-red-600 shadow-sm">
        <AlertTriangle className="size-6" />
      </div>
      <h3 className="font-sans text-base font-bold text-red-900">{title}</h3>
      {message && <p className="mt-1 max-w-md text-sm text-red-800/80">{message}</p>}
      {onRetry && (
        <button onClick={onRetry} className="btn-outline mt-5">
          <RotateCw className="size-4" /> Try again
        </button>
      )}
    </div>
  );
}

export function CourseCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-video rounded-md bg-line/60" />
      <div className="mt-3 h-4 w-4/5 rounded bg-line/60" />
      <div className="mt-2 h-3 w-full rounded bg-line/40" />
      <div className="mt-1.5 h-3 w-2/3 rounded bg-line/40" />
      <div className="mt-3 h-4 w-16 rounded bg-line/60" />
    </div>
  );
}

import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";

type BaseProps = { label: string; error?: string; hint?: ReactNode; id: string };

export function Field({
  label,
  error,
  hint,
  id,
  ...props
}: BaseProps & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label htmlFor={id} className="label">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={`input ${error ? "input-error" : ""}`}
        {...props}
      />
      <FieldFooter id={id} error={error} hint={hint} />
    </div>
  );
}

export function TextArea({
  label,
  error,
  hint,
  id,
  ...props
}: BaseProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div>
      <label htmlFor={id} className="label">
        {label}
      </label>
      <textarea
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={`input min-h-28 resize-y ${error ? "input-error" : ""}`}
        {...props}
      />
      <FieldFooter id={id} error={error} hint={hint} />
    </div>
  );
}

function FieldFooter({ id, error, hint }: { id: string; error?: string; hint?: ReactNode }) {
  if (error)
    return (
      <p id={`${id}-error`} className="mt-1.5 text-xs font-medium text-red-600">
        {error}
      </p>
    );
  if (hint)
    return (
      <p id={`${id}-hint`} className="mt-1.5 text-xs text-muted">
        {hint}
      </p>
    );
  return null;
}

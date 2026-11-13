import { useState, type FormEvent } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff, LockKeyhole } from "lucide-react";
import { Logo } from "../../components/Logo";
import { Field } from "../../components/ui/Field";
import { LoadingState, Spinner } from "../../components/ui/States";
import { useAuth } from "../../context/AuthContext";
import { ApiError } from "../../lib/api";

export function AdminLoginPage() {
  const { admin, checking, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [formError, setFormError] = useState("");
  const [busy, setBusy] = useState(false);

  if (checking) return <LoadingState />;
  if (admin) return <Navigate to={from} replace />;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const found: typeof errors = {};
    if (!email.trim()) found.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(email.trim())) found.email = "Enter a valid email";
    if (!password) found.password = "Password is required";
    setErrors(found);
    setFormError("");
    if (Object.keys(found).length) return;

    setBusy(true);
    try {
      await login(email.trim(), password);
      navigate(from, { replace: true });
    } catch (err) {
      if (err instanceof ApiError && Object.keys(err.fieldErrors).length) setErrors(err.fieldErrors);
      setFormError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <div className="hidden flex-col justify-between bg-gradient-to-br from-brand-800 to-[#2e0b66] p-12 text-white lg:flex">
        <Logo light />
        <div>
          <h1 className="text-4xl leading-tight font-bold">Manage your courses in one place.</h1>
          <p className="mt-4 max-w-md text-white/80">
            Create courses, add video lectures and keep your catalogue up to date for students.
          </p>
        </div>
        <p className="text-sm text-white/50">LearnForge Admin</p>
      </div>

      <div className="flex flex-col justify-center px-4 py-12 sm:px-12">
        <div className="mx-auto w-full max-w-sm">
          <div className="lg:hidden">
            <Logo />
          </div>
          <div className="mt-8 grid size-12 place-items-center rounded-full bg-brand-50 text-brand-700 lg:mt-0">
            <LockKeyhole className="size-6" />
          </div>
          <h2 className="mt-4 text-3xl font-bold">Admin login</h2>
          <p className="mt-1 text-sm text-muted">Sign in to manage courses and lectures.</p>

          {formError && (
            <div role="alert" className="mt-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {formError}
            </div>
          )}

          <form onSubmit={submit} noValidate className="mt-6 space-y-4">
            <Field
              id="email"
              label="Email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              placeholder="admin@lms.com"
              autoFocus
            />
            <div className="relative">
              <Field
                id="password"
                label="Password"
                type={show ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                className="absolute top-[34px] right-2 rounded p-1.5 text-muted hover:text-ink"
                aria-label={show ? "Hide password" : "Show password"}
              >
                {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            <button type="submit" disabled={busy} className="btn-primary w-full py-3">
              {busy && <Spinner className="size-4" />} Log in
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted">
            <Link to="/" className="font-semibold text-brand-700 hover:underline">
              ← Back to courses
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

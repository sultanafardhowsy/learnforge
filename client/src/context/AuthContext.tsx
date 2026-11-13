import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { api, setUnauthorizedHandler, tokenStore } from "../lib/api";
import type { Admin } from "../lib/types";

type AuthState = {
  admin: Admin | null;
  /** True while we verify a stored token on first load. */
  checking: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [checking, setChecking] = useState(() => Boolean(tokenStore.get()));

  const logout = useCallback(() => {
    tokenStore.clear();
    setAdmin(null);
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(logout);
    return () => setUnauthorizedHandler(null);
  }, [logout]);

  // Restore the session from a saved token.
  useEffect(() => {
    if (!tokenStore.get()) return;
    api
      .me()
      .then(setAdmin)
      .catch(() => tokenStore.clear())
      .finally(() => setChecking(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { token, admin } = await api.login(email, password);
    tokenStore.set(token);
    setAdmin(admin);
  }, []);

  const value = useMemo(() => ({ admin, checking, login, logout }), [admin, checking, login, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

"use client";

import * as React from "react";

type User = { email: string };

type AuthCtx = {
  user: User | null;
  login: (email: string, password: string) => { ok: true } | { ok: false; error: string };
  logout: () => void;
};

const KEY = "yumyum_customer_session_v1";
const AuthContext = React.createContext<AuthCtx | null>(null);

export function CustomerAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed?.email) setUser({ email: String(parsed.email) });
    } catch {
      // ignore
    }
  }, []);

  const value = React.useMemo<AuthCtx>(() => {
    return {
      user,
      login: (email, password) => {
        const e = email.trim().toLowerCase();
        const p = password.trim();
        if (!e.includes("@")) return { ok: false, error: "Enter a valid email." };
        if (p.length < 4) return { ok: false, error: "Password too short." };

        // Demo login: stores session only (no server yet)
        const u = { email: e };
        setUser(u);
        try {
          localStorage.setItem(KEY, JSON.stringify(u));
        } catch {}
        return { ok: true };
      },
      logout: () => {
        setUser(null);
        try {
          localStorage.removeItem(KEY);
        } catch {}
      },
    };
  }, [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useCustomerAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useCustomerAuth must be used inside <CustomerAuthProvider>");
  return ctx;
}
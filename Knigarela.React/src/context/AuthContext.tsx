"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { login as apiLogin, logout as apiLogout } from "@/api/auth";
import { tokenStore } from "@/lib/tokenStore";

type AuthCtx = {
  isAuthed: boolean;
  accessToken: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // hydrate from localStorage on client
  useEffect(() => {
    setAccessToken(tokenStore.access);
  }, []);

  async function login(email: string, password: string) {
    await apiLogin(email, password);
    setAccessToken(tokenStore.access);
  }

  async function logout() {
    await apiLogout();
    setAccessToken(null);
  }

  const value = useMemo(
    () => ({ isAuthed: !!accessToken, accessToken, login, logout }),
    [accessToken]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider/>");
  return ctx;
}

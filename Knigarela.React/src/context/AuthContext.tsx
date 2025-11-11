"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { login as apiLogin, logout as apiLogout } from "@/api/auth";
import { tokenStore } from "@/lib/tokenStore";

type UserInfo = {
    id: string | null;
    email: string | null;
    role: string | null;
    exp: number | null;
};

type AuthCtx = {
    isAuthed: boolean;
    accessToken: string | null;
    user: UserInfo | null;
    hydrated: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
};

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [user, setUser] = useState<UserInfo | null>(null);
    const [hydrated, setHydrated] = useState(false);

    function decodeToken(token: string): UserInfo | null {
        try {
            const decoded: any = jwtDecode(token);
            const role =
                decoded.role ||
                decoded.roles?.[0] ||
                decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

            const id =
                decoded.sub ||
                decoded.nameid ||
                decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];

            const email =
                decoded.email ||
                decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"];

            return { id: id || null, email: email || null, role: role || null, exp: decoded.exp || null };
        } catch {
            return null;
        }
    }

    // Load token from tokenStore on startup
    useEffect(() => {
        const token = tokenStore.access;
        if (token) {
            setAccessToken(token);
            setUser(decodeToken(token));
        }
        setHydrated(true); // ✅ prevents redirect flicker
    }, []);

    async function login(email: string, password: string) {
        await apiLogin(email, password);
        const token = tokenStore.access;
        setAccessToken(token);
        setUser(token ? decodeToken(token) : null);
    }

    async function logout() {
        await apiLogout();
        setAccessToken(null);
        setUser(null);
    }

    // Optional: auto logout if token expired
    useEffect(() => {
        if (user?.exp && Date.now() / 1000 > user.exp) logout();
    }, [user]);

    const value = useMemo(
        () => ({
            isAuthed: !!accessToken,
            accessToken,
            user,
            hydrated,
            login,
            logout,
        }),
        [accessToken, user, hydrated]
    );

    return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
    const ctx = useContext(Ctx);
    if (!ctx) throw new Error("useAuth must be used within <AuthProvider/>");
    return ctx;
}

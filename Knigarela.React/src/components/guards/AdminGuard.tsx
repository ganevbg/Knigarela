"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext"; // adjust path if needed
import { Loader2 } from "lucide-react";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const { isAuthed, user, hydrated } = useAuth();

    useEffect(() => {
        if (!hydrated) return; // ⏳ wait for tokenStore load

        if (!isAuthed) {
            router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
        } else if (user?.role !== "Admin") {
            router.replace("/");
        }
    }, [hydrated, isAuthed, user, pathname, router]);

    // While loading, render a spinner
    if (!hydrated) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
            </div>
        );
    }

    // Once hydrated, show page only if user is admin
    if (isAuthed && user?.role === "Admin") {
        return <>{children}</>;
    }

    return null;
}

"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
    const { isAuthed, user } = useAuth(); // assumes user?.role is available
    const router = useRouter();

    useEffect(() => {
        if (!isAuthed) router.replace("/");
        else if (user?.role !== "Admin") router.replace("/"); // or "/not-authorized"
    }, [isAuthed, user?.role, router]);

    // Minimal anti-flicker while checking
    if (!isAuthed || user?.role !== "Admin") {
        return (
            <div className="flex min-h-[40vh] items-center justify-center text-gray-500">
                Проверка на достъп...
            </div>
        );
    }

    return <>{children}</>;
}

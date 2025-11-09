"use client";
import { ActiveBox } from "@/components/active-box"
import { PreviousBoxesCarousel } from "@/components/previous-boxes-carousel"
import { Navbar } from "@/components/navbar"
import { Header } from "@/components/header"
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
export default function Home() {
    return (
        <>
            <Navbar />

            <main className="min-h-screen">

                <Header />

                <section className="w-full bg-white px-4 py-16">
                    <div className="mx-auto max-w-5xl">
                        <ActiveBox />
                    </div>
                </section>

                <section className="w-full px-4 py-16" style={{ backgroundColor: "#fff5fa" }}>
                    <div className="mx-auto max-w-7xl">
                        <h2 className="mb-12 text-center text-3xl font-semibold md:text-4xl" style={{ color: "#2d2d2d" }}>
                            Предишни кутии
                        </h2>
                        <PreviousBoxesCarousel />
                    </div>
                </section>

                <section className="w-full bg-white px-4 py-16">
                    <div className="mx-auto max-w-7xl">
                        <h2 className="mb-12 text-center text-3xl font-semibold md:text-4xl" style={{ color: "#2d2d2d" }}>
                            Защо Книгарела?
                        </h2>
                        <div className="grid gap-8 md:grid-cols-3">
                            <div className="text-center">
                                <div className="mb-4 text-5xl">📚</div>
                                <h3 className="mb-2 text-xl font-semibold" style={{ color: "#D176A3" }}>
                                    Внимателно подбрани книги
                                </h3>
                                <p className="text-gray-600">Всяка книга е избрана с любов и внимание към детайла</p>
                            </div>
                            <div className="text-center">
                                <div className="mb-4 text-5xl">🎁</div>
                                <h3 className="mb-2 text-xl font-semibold" style={{ color: "#D176A3" }}>
                                    Изненади всеки месец
                                </h3>
                                <p className="text-gray-600">Получавайте нови литературни приключения на вашата врата</p>
                            </div>
                            <div className="text-center">
                                <div className="mb-4 text-5xl">💝</div>
                                <h3 className="mb-2 text-xl font-semibold" style={{ color: "#D176A3" }}>
                                    Перфектен подарък
                                </h3>
                                <p className="text-gray-600">Идеалният начин да покажете грижа към любителите на книги</p>
                            </div>
                        </div>
                    </div>
                </section>

                <footer className="w-full px-4 py-8" style={{ backgroundColor: "#fff5fa" }}>
                    <div className="mx-auto max-w-7xl text-center">
                        <p className="text-sm font-light" style={{ color: "#6b6b6b" }}>
                            © 2025 Knigarela – Твоето приказно време започва тук.
                        </p>
                    </div>
                </footer>
            </main>
        </>
    )
}

export function LoginPage() {
    const { login, isAuthed } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [err, setErr] = useState<string | null>(null);
    const [busy, setBusy] = useState(false);

    async function submit(e: React.FormEvent) {
        e.preventDefault();
        setErr(null);
        setBusy(true);
        try {
            await login(email, password);
        } catch (e: any) {
            setErr(e?.message || "Login failed");
        } finally {
            setBusy(false);
        }
    }

    if (isAuthed) return <div className="p-6">Вече сте логнати ✅</div>;

    return (
        <form onSubmit={submit} className="mx-auto max-w-sm space-y-3 p-6">
            <h1 className="text-xl font-semibold">Вход</h1>
            <input className="w-full rounded border p-2" placeholder="Имейл" value={email} onChange={e => setEmail(e.target.value)} />
            <input className="w-full rounded border p-2" placeholder="Парола" type="password" value={password} onChange={e => setPassword(e.target.value)} />
            {err && <div className="text-sm text-red-600">{err}</div>}
            <button disabled={busy} className="rounded bg-black px-4 py-2 text-white">{busy ? "..." : "Влез"}</button>
        </form>
    );
}
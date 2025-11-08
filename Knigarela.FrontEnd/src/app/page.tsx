"use client";
import { ActiveBox } from "@/components/active-box"
import { PreviousBoxesCarousel } from "@/components/previous-boxes-carousel"
import { Navbar } from "@/components/navbar"
import Image from "next/image"

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen">
        <header className="w-full py-16 px-4" style={{ backgroundColor: "#ffcfe7" }}>
          <div className="max-w-7xl mx-auto text-center">
            <div className="flex justify-center mb-4">
              <img src="/logo.svg" alt="Книгарела" className="h-20 w-auto" loading="eager" />
            </div>
            <p className="mt-6 text-xl md:text-2xl font-light text-white">Твоето приказно време започва тук.</p>
          </div>
        </header>

        <section className="w-full px-4 py-16 bg-white">
          <div className="max-w-5xl mx-auto">
            <ActiveBox />
          </div>
        </section>

        <section className="w-full px-4 py-16" style={{ backgroundColor: "#fff5fa" }}>
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-semibold text-center mb-12" style={{ color: "#2d2d2d" }}>
              Предишни кутии
            </h2>
            <PreviousBoxesCarousel />
          </div>
        </section>

        <section className="w-full px-4 py-16 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-semibold text-center mb-12" style={{ color: "#2d2d2d" }}>
              Защо Книгарела?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-5xl mb-4">📚</div>
                <h3 className="text-xl font-semibold mb-2" style={{ color: "#ffcfe7" }}>
                  Внимателно подбрани книги
                </h3>
                <p className="text-gray-600">Всяка книга е избрана с любов и внимание към детайла</p>
              </div>
              <div className="text-center">
                <div className="text-5xl mb-4">🎁</div>
                <h3 className="text-xl font-semibold mb-2" style={{ color: "#ffcfe7" }}>
                  Изненади всеки месец
                </h3>
                <p className="text-gray-600">Получавайте нови литературни приключения на вашата врата</p>
              </div>
              <div className="text-center">
                <div className="text-5xl mb-4">💝</div>
                <h3 className="text-xl font-semibold mb-2" style={{ color: "#ffcfe7" }}>
                  Перфектен подарък
                </h3>
                <p className="text-gray-600">Идеалният начин да покажете грижа към любителите на книги</p>
              </div>
            </div>
          </div>
        </section>

        <footer className="w-full py-8 px-4" style={{ backgroundColor: "#fff5fa" }}>
          <div className="max-w-7xl mx-auto text-center">
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
    <form onSubmit={submit} className="max-w-sm mx-auto p-6 space-y-3">
      <h1 className="text-xl font-semibold">Вход</h1>
      <input className="w-full border p-2 rounded" placeholder="Имейл" value={email} onChange={e=>setEmail(e.target.value)}/>
      <input className="w-full border p-2 rounded" placeholder="Парола" type="password" value={password} onChange={e=>setPassword(e.target.value)}/>
      {err && <div className="text-red-600 text-sm">{err}</div>}
      <button disabled={busy} className="px-4 py-2 rounded bg-black text-white">{busy ? "..." : "Влез"}</button>
    </form>
  );
}
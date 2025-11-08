"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthed } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Handle submit
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      router.push("/"); // redirect after login
    } catch (err: any) {
      setError(err?.message || "Невалиден имейл или парола");
    } finally {
      setLoading(false);
    }
  }

  // If already logged in
  if (isAuthed) {
    return (
      <div className="flex h-[70vh] items-center justify-center text-lg font-medium text-[#D176A3]">
        Вече сте влезли ✅
      </div>
    );
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border border-gray-100 bg-white p-8 shadow-md"
      >
        <h1 className="mb-6 text-center text-2xl font-semibold text-[#D176A3]">
          Вход в Книгарела
        </h1>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Имейл"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D176A3]"
          />

          <input
            type="password"
            placeholder="Парола"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D176A3]"
          />

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#D176A3] py-2 font-medium text-white transition-colors duration-200 hover:bg-[#ff559e]"
          >
            {loading ? "Влизане..." : "Вход"}
          </button>
        </div>
      </form>
    </div>
  );
}

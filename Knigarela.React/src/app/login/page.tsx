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
      <div className="flex justify-center items-center h-[70vh] text-lg text-[#ffcfe7] font-medium">
        Вече сте влезли ✅
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[70vh] px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-md border border-gray-100"
      >
        <h1 className="text-2xl font-semibold text-center text-[#ffcfe7] mb-6">
          Вход в Книгарела
        </h1>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Имейл"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffcfe7]"
          />

          <input
            type="password"
            placeholder="Парола"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffcfe7]"
          />

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#ffcfe7] text-white py-2 rounded-lg font-medium hover:bg-[#ff559e] transition-colors duration-200"
          >
            {loading ? "Влизане..." : "Вход"}
          </button>
        </div>
      </form>
    </div>
  );
}

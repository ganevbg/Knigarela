import { api } from "@/lib/api";
import { tokenStore } from "@/lib/tokenStore";

export async function login(email: string, password: string) {
  const { data } = await api.post("/api/auth/login", { Email: email, Password: password });
  const { accessToken, refreshToken } = data as { accessToken: string; refreshToken: string };
  tokenStore.set({ accessToken, refreshToken });
  return data;
}

export async function logout() {
  try {
    await api.post("/api/auth/logout");
  } catch {}
  tokenStore.clear();
}

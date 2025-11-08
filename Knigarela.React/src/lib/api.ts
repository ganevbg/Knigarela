import axios, { AxiosError } from "axios";
import { tokenStore } from "./tokenStore";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "/";
const TIMEOUT = Number(process.env.NEXT_PUBLIC_API_TIMEOUT ?? 10000);

export const api = axios.create({
  baseURL: API_URL,
  timeout: TIMEOUT,
  withCredentials: true,
});

// Attach access token
api.interceptors.request.use((config) => {
  const t = tokenStore.access;
  if (t) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${t}`;
  }
  return config;
});

// Single-flight refresh queue
let refreshing = false;
let waiters: Array<(t: string | null) => void> = [];
const wake = (t: string | null) => { waiters.forEach(w => w(t)); waiters = []; };

api.interceptors.response.use(
  (r) => r,
  async (error: AxiosError) => {
    const original = error.config as any;
    if (error.response?.status !== 401 || original?._retry) throw error;
    original._retry = true;

    try {
      // Wait for ongoing refresh
      if (refreshing) {
        const newToken = await new Promise<string | null>(resolve => waiters.push(resolve));
        if (!newToken) throw error;
        original.headers = { ...(original.headers || {}), Authorization: `Bearer ${newToken}` };
        return api(original);
      }

      refreshing = true;
      const rt = tokenStore.refresh;
      if (!rt) throw error;

      const { data } = await axios.post(`${API_URL}/api/auth/refresh`, { refreshToken: rt });
      const { accessToken, refreshToken } = data as { accessToken: string; refreshToken: string };
      tokenStore.set({ accessToken, refreshToken });

      refreshing = false;
      wake(accessToken);

      original.headers = { ...(original.headers || {}), Authorization: `Bearer ${accessToken}` };
      return api(original);
    } catch (e) {
      refreshing = false;
      wake(null);
      tokenStore.clear();
      throw e;
    }
  }
);

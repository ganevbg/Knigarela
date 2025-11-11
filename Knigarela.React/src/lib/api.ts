import axios, { AxiosError } from "axios";
import { tokenStore } from "./tokenStore";
import { toast } from "react-toastify";

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

api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        // Allow the token-refresh interceptor above to handle 401s
        if (error.response?.status === 401) {
            return Promise.reject(error);
        }

        // Handle network error (no response at all)
        if (!error.response) {
            toast.error("Няма връзка със сървъра. Опитайте отново по-късно.");
            return Promise.reject(error);
        }

        const { status, data } = error.response;

        switch (status) {
            case 400:
                toast.error((data as any)?.message || "Невалидна заявка.");
                break;
            case 403:
                toast.error("Нямате достъп до тази операция.");
                break;
            case 404:
                toast.error("Не е намерен ресурс.");
                break;
            case 409:
                const error = (data as any)?.error as string;
                switch (error) {
                    case "InsufficientStock":
                        toast.error(`Няма достатъчна наличност. Налични са ${(data as any)?.availableQuantity ?? "0"} броя.`);
                        break;
                    case "CartIsEmpty":
                        toast.error(`Няма добавени артикули в количката.`);
                        break;
                    default:
                        toast.error((data as any)?.message || "Конфликт при обработка на заявката.");
                        break;
                }
                break;
            case 500:
                toast.error("Грешка на сървъра. Моля, опитайте отново по-късно.");
                break;
            default:
                toast.error((data as any)?.message || "Възникна неочаквана грешка.");
                break;
        }

        // Always reject so local code can still catch if needed
        return Promise.reject(error);
    }
);
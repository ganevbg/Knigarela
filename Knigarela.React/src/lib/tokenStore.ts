export type Tokens = { accessToken: string; refreshToken: string };

const ACCESS = "accessToken";
const REFRESH = "refreshToken";

export const tokenStore = {
  get access() {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(ACCESS);
  },
  get refresh() {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(REFRESH);
  },
  set(tokens: Tokens) {
    if (typeof window === "undefined") return;
    localStorage.setItem(ACCESS, tokens.accessToken);
    localStorage.setItem(REFRESH, tokens.refreshToken);
  },
  clear() {
    if (typeof window === "undefined") return;
    localStorage.removeItem(ACCESS);
    localStorage.removeItem(REFRESH);
  },
};

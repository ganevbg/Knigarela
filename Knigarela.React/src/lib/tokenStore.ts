export type Tokens = { accessToken: string; refreshToken: string };

const ACCESS = "accessToken";
const REFRESH = "refreshToken";

export const tokenStore = {
    // Read from localStorage first, then from sessionStorage
    get access() {
        if (typeof window === "undefined") return null;
        return (
            localStorage.getItem(ACCESS) ||
            sessionStorage.getItem(ACCESS)
        );
    },

    get refresh() {
        if (typeof window === "undefined") return null;
        return (
            localStorage.getItem(REFRESH) ||
            sessionStorage.getItem(REFRESH)
        );
    },

    /**
     * Save tokens in either localStorage (remember=true)
     * or sessionStorage (remember=false)
     */
    set(tokens: Tokens, remember: boolean) {
        if (typeof window === "undefined") return;

        // Clear previous storage to avoid conflicts
        this.clear();

        if (remember) {
            localStorage.setItem(ACCESS, tokens.accessToken);
            localStorage.setItem(REFRESH, tokens.refreshToken);
        } else {
            sessionStorage.setItem(ACCESS, tokens.accessToken);
            sessionStorage.setItem(REFRESH, tokens.refreshToken);
        }
    },

    clear() {
        if (typeof window === "undefined") return;

        localStorage.removeItem(ACCESS);
        localStorage.removeItem(REFRESH);
        sessionStorage.removeItem(ACCESS);
        sessionStorage.removeItem(REFRESH);
    },
};

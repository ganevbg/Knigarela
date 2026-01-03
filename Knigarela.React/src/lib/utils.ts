import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function resolveImageUrl(url: string) {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) {
        return url; // Already absolute → R2
    }
    // Otherwise it's local relative URL → DEV mode
    return `${process.env.NEXT_PUBLIC_API_URL}${url}`;
}


export function formatPrice(
    value: number,
    showBothCurrencies: boolean = false
): string {
    if (isNaN(value)) return "";

    const formatterBGN = new Intl.NumberFormat("bg-BG", {
        style: "currency",
        currency: "BGN",
        minimumFractionDigits: 2,
    });

    const formatterEUR = new Intl.NumberFormat("bg-BG", {
        style: "currency",
        currency: "EUR",
        minimumFractionDigits: 2,
    });

    if (showBothCurrencies) {
        return `${formatterEUR.format(value)} (${formatterBGN.format(value / 0.51)})`;
    }

    return formatterEUR.format(value);
}
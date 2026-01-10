import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function resolveImageUrl(url: string) {
    if (!url) return "";

    const isDev = process.env.NODE_ENV === "development";
    if (isDev) return `${process.env.NEXT_PUBLIC_API_URL}${url}`;

    return url;
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
        return `${formatterEUR.format(value)} (${formatterBGN.format(value * 1.95583)})`;
    }

    return formatterEUR.format(value);
}
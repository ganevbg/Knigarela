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

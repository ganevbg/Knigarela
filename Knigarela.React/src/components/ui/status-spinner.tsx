"use client"

import { Loader2 } from "lucide-react"

interface StatusSpinnerProps {
    text?: string
}

export function StatusSpinner({ text }: StatusSpinnerProps) {
    return (
        <div className="flex items-center gap-2 text-[var(--knigarela-pink)]">
            <Loader2 className="h-5 w-5 animate-spin" />
            {text && <span className="font-medium">{text}</span>}
        </div>
    )
}

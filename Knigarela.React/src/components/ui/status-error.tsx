"use client"

import { AlertCircle } from "lucide-react"

interface StatusErrorProps {
    text?: string
}

export function StatusError({ text }: StatusErrorProps) {
    return (
        <div className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            {text && <span className="font-medium">{text}</span>}
        </div>
    )
}

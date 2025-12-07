"use client"

import { CheckCircle2 } from "lucide-react"

interface StatusSuccessProps {
    text?: string
}

export function StatusSuccess({ text }: StatusSuccessProps) {
    return (
        <div className="flex items-center gap-2 text-green-600">
            <CheckCircle2 className="h-5 w-5" />
            {text && <span className="font-medium">{text}</span>}
        </div>
    )
}

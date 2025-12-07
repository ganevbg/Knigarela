"use client"

import { useEffect, useState } from "react"
import { StatusSpinner } from "@/components/ui/status-spinner"
import { StatusSuccess } from "@/components/ui/status-success"
import { StatusError } from "@/components/ui/status-error"
import { api } from "@/lib/api"
import { X } from "lucide-react"

interface JobStatusProps {
    jobId: string
    statusUrl: string
    onDone?: () => void
    onClose?: () => void
}

export function JobStatus({ jobId, statusUrl, onDone, onClose }: JobStatusProps) {
    const [status, setStatus] = useState<string>("Enqueued")
    const [canClose, setCanClose] = useState(false)

    useEffect(() => {
        let alive = true

        const interval = setInterval(async () => {
            const res = await api.get(`${statusUrl}/${jobId}`)
            const s = res.data.status

            if (!alive) return
            setStatus(s)

            // success
            if (s === "Succeeded") {
                clearInterval(interval)
                setCanClose(true)
                onDone?.()
            }

            // fail
            if (["Failed", "Deleted"].includes(s)) {
                clearInterval(interval)
                setCanClose(true)
            }
        }, 5000)

        return () => {
            alive = false
            clearInterval(interval)
        }
    }, [jobId, statusUrl])

    const handleClose = () => {
        if (canClose && onClose) {
            onClose()
        }
    }

    return (
        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    {["Enqueued", "Processing", "Scheduled", "AwaitingRetry"].includes(status) && (
                        <StatusSpinner text="Създаване на товарителници..." />
                    )}
                    {status === "Succeeded" && <StatusSuccess text="Товарителниците са създадени успешно!" />}
                    {["Failed", "Deleted"].includes(status) && (
                        <StatusError text="Възникна грешка при създаването на товарителниците." />
                    )}
                </div>

                {canClose && (
                    <button
                        onClick={handleClose}
                        className="ml-4 rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                        aria-label="Затвори"
                    >
                        <X className="h-5 w-5" />
                    </button>
                )}
            </div>
        </div>
    )
}


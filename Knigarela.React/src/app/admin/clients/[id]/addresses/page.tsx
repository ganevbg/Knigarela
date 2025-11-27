"use client"

import { DataTable } from "@/components/admin/data-table"
import type { DataTableConfig } from "@/components/admin/data-table"
import { useParams } from 'next/navigation'
import Link from "next/link"
import { ArrowLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { getClientAddressesById, deleteClientAddressById } from "@/api/clients"
import { ClientAddress } from "@/types/api"
import { PaginationParams } from "@/types/common/PaginationParams"


const fetchClientAddresses = async (clientId: string, params: PaginationParams<keyof ClientAddress>) => {
    const result = await getClientAddressesById(clientId, params)

    return {
        data: result.data,
        total: result.total,
    }
}

async function deleteAddress(clientId: string, id: string) {
    await deleteClientAddressById(clientId, id)
}

export default function ClientAddressesPage() {
    const params = useParams()
    const clientId = params.id as string

    const config: DataTableConfig<ClientAddress> = {
        title: `Адреси на клиент`,
        description: "Управление на адресите за доставка",
        columns: [
            {
                key: "deliveryType",
                label: "Тип",
                render: (value) => (
                    <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${value === "personal"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                            }`}
                    >
                        {value === "personal" ? "Личен" : "Куриер"}
                    </span>
                ),
            },
            {
                key: "siteName",
                label: "Град",
                render: (value) => value || "-",
            },
            {
                key: "addressText",
                label: "Адрес/Офис",
                render: (value, row) => {
                    if (row.deliveryType === "personal") {
                        return value || "-"
                    }
                    return row.officeName || "-"
                },
            },
            {
                key: "isDefault",
                label: "По подразбиране",
                sortable: false,
                render: (value) =>
                    value ? (
                        <span className="inline-flex items-center rounded-full bg-[var(--knigarela-pink-light)] px-2.5 py-0.5 text-xs font-medium text-[var(--knigarela-pink)]">
                            Да
                        </span>
                    ) : (
                        <span className="text-gray-400">Не</span>
                    ),
            },
        ],
        createUrl: `/admin/clients/${clientId}/addresses/create`,
        editUrl: (id) => `/admin/clients/${clientId}/addresses/${id}`,
        fetchData: (params) => fetchClientAddresses(clientId, params),
        filters: [
            {
                key: "addressText",
                label: "Адрес/Офис",
                type: "text",
                placeholder: "Търсене по Адрес/Офис...",
            },
            {
                key: "deliveryType",
                label: "Тип",
                type: "select",
                defaultValue: "all",
                options: [
                    { label: "Всички", value: "all" },
                    { label: "Личнен", value: "personal" },
                    { label: "Куриер", value: "courier" },
                ],
            },
        ],
        deleteItem: (id) => deleteAddress(clientId, id),
        deleteConfirmation: {
            title: "Изтриване на адрес",
            description: () => "Сигурни ли сте, че искате да изтриете този адрес? Това действие не може да бъде отменено.",
        },
    }

    return (
        <div>
            {/* Back button */}
            <div className="border-b border-gray-200 bg-white">
                <div className="container mx-auto px-4 py-4">
                    <Link href="/admin/clients/">
                        <Button variant="ghost" size="sm" className="text-[var(--knigarela-text-light)] hover:text-[var(--knigarela-text)]">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Назад към клиентите
                        </Button>
                    </Link>
                </div>
            </div>
            <DataTable config={config} />
        </div>
    )
}

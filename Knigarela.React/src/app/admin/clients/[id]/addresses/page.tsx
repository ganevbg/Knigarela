"use client"

import { DataTable } from "@/components/admin/data-table"
import type { DataTableConfig } from "@/components/admin/data-table"
import { useParams } from 'next/navigation'
import Link from "next/link"
import { ArrowLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { getClientAddressesById, deleteClientAddressById } from "@/api/clients"

interface ClientAddress {
    id: string
    deliveryType: "personal" | "courier"
    siteName: string
    addressText: string
    officeName: string
    isDefault: boolean
    createdAt: string
}

// Mock API function - replace with real API calls
async function fetchClientAddresses(
    clientId: string,
    params: {
        searchQuery: string
        filterValue: string
        sortColumn: keyof ClientAddress
        sortDirection: "asc" | "desc"
        page: number
        itemsPerPage: number
    }
) {

    // Mock data - in real app, filter by clientId
    const allAddresses: ClientAddress[] = await getClientAddressesById(clientId)

    // Filter by type
    let filtered = allAddresses
    if (params.filterValue !== "all") {
        filtered = filtered.filter((addr) => addr.deliveryType === params.filterValue)
    }

    // Filter by search query
    if (params.searchQuery) {
        filtered = filtered.filter(
            (addr) =>
                addr.siteName.toLowerCase().includes(params.searchQuery.toLowerCase()) ||
                addr.addressText.toLowerCase().includes(params.searchQuery.toLowerCase()) ||
                addr.officeName.toLowerCase().includes(params.searchQuery.toLowerCase())
        )
    }

    // sort
    filtered.sort((a, b) => {
        const aval = a[params.sortColumn]
        const bval = b[params.sortColumn]
        if (params.sortDirection === "asc") {
            return aval > bval ? 1 : -1
        }
        return aval < bval ? 1 : -1
    })

    // Paginate
    const start = (params.page - 1) * params.itemsPerPage
    const end = start + params.itemsPerPage
    const paginated = filtered.slice(start, end)

    return {
        data: paginated,
        total: filtered.length,
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
                label: "Град    ",
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
            {
                key: "createdAt",
                label: "Създаден на",
                render: (value) => new Date(value).toLocaleDateString("bg-BG"),
            },
        ],
        createUrl: `/admin/clients/${clientId}/addresses/create`,
        editUrl: (id) => `/admin/clients/${clientId}/addresses/${id}`,
        fetchData: (params) => fetchClientAddresses(clientId, params),
        deleteItem: (id) => deleteAddress(clientId, id),
        searchPlaceholder: "Търсене по град или адрес...",
        filterOptions: [
            { label: "Всички адреси", value: "all" },
            { label: "Лични адреси", value: "personal" },
            { label: "Куриер", value: "courier" },
        ],
        filterLabel: "Тип адрес",
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

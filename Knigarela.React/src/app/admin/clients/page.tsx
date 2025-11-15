"use client"

import { DataTable } from "@/components/admin/data-table"
import type { DataTableConfig } from "@/components/admin/data-table"
import { getAllClients, deleteClientById } from "@/api/clients"
import { MapPin } from 'lucide-react'

interface Client {
    id: string
    fullName: string,
    defaultAddress: string,
    email: string
    phone: string
    isSubscribed: boolean
    subscriptionDate: string
    subscriptionCancellationCount: number
    createdAt: string
}

// Mock API function - replace with real API calls
async function fetchClients(params: {
    searchQuery: string
    filterValue: string
    sortColumn: keyof Client
    sortDirection: "asc" | "desc"
    page: number
    itemsPerPage: number
}) {
    const allClients: Client[] = await getAllClients();

    // Filter by search query
    let filtered = allClients
    if (params.searchQuery) {
        filtered = filtered.filter(
            (client) =>
                client.fullName.toLowerCase().includes(params.searchQuery.toLowerCase()) ||
                client.defaultAddress?.toLowerCase().includes(params.searchQuery.toLowerCase()) ||
                client.email.toLowerCase().includes(params.searchQuery.toLowerCase()) ||
                client.phone.includes(params.searchQuery)
        )
    }

    // Sort
    filtered.sort((a, b) => {
        const aVal = a[params.sortColumn]
        const bVal = b[params.sortColumn]
        if (params.sortDirection === "asc") {
            return aVal > bVal ? 1 : -1
        }
        return aVal < bVal ? 1 : -1
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

async function deleteClient(id: string) {
    await deleteClientById(id);
}

export default function AdminClientsPage() {
    const config: DataTableConfig<Client> = {
        title: "Клиенти",
        description: "Управление на клиентските профили и информация",
        columns: [
            {
                key: "fullName",
                label: "Име",
            },
            {
                key: "defaultAddress",
                label: "Адрес по подразбиране",
                render: (value) => <span className="font-medium">{value ?? ""}</span>,
            },
            {
                key: "email",
                label: "Имейл",
            },
            {
                key: "phone",
                label: "Телефон",
            },
            {
                key: "isSubscribed",
                label: "Абонат ли е",
                render: (value) => <span className="font-medium">{value ? "Да" : "Не"}</span>,
            },
            {
                key: "subscriptionDate",
                label: "Дата на абониране",
                render: (value) => <span className="font-semibold text-[var(--knigarela-pink)]">{value ? new Date(value).toLocaleDateString("bg-BG") : ""}</span>,
            },
            {
                key: "subscriptionCancellationCount",
                label: "Брой отписвания",
            },
        ],
        createUrl: "/admin/clients/create",
        editUrl: (id) => `/admin/clients/${id}`,
        fetchData: fetchClients,
        deleteItem: deleteClient,
        searchPlaceholder: "Търсене по име, адрес по подразбиране, имейл или телефон...",
        deleteConfirmation: {
            title: "Изтриване на клиент",
            description: (client) =>
                `Сигурни ли сте, че искате да изтриете клиента ${client.fullName}? Това действие не може да бъде отменено.`,
        },
        customActions: [
            {
                icon: MapPin,
                href: (client) => `/admin/clients/${client.id}/addresses`,
                label: "Адреси"
            },
        ],
    }

    return <DataTable config={config} />
}

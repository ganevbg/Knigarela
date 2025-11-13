"use client"

import { DataTable } from "@/components/admin/data-table"
import type { DataTableConfig } from "@/components/admin/data-table"

interface Client {
    id: string
    name: string
    email: string
    phone: string
    totalOrders: number
    totalSpent: number
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
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Mock data
    const allClients: Client[] = [
        {
            id: "1",
            name: "Иван Петров",
            email: "ivan.petrov@example.com",
            phone: "+359 888 123 456",
            totalOrders: 12,
            totalSpent: 599.88,
            createdAt: "2024-01-15",
        },
        {
            id: "2",
            name: "Мария Георгиева",
            email: "maria.g@example.com",
            phone: "+359 887 654 321",
            totalOrders: 5,
            totalSpent: 249.95,
            createdAt: "2024-02-20",
        },
        {
            id: "3",
            name: "Георги Димитров",
            email: "georgi.d@example.com",
            phone: "+359 899 111 222",
            totalOrders: 8,
            totalSpent: 399.92,
            createdAt: "2024-03-10",
        },
        {
            id: "4",
            name: "Елена Иванова",
            email: "elena.ivanova@example.com",
            phone: "+359 877 333 444",
            totalOrders: 15,
            totalSpent: 749.85,
            createdAt: "2023-12-05",
        },
        {
            id: "5",
            name: "Петър Стоянов",
            email: "petar.s@example.com",
            phone: "+359 888 555 666",
            totalOrders: 3,
            totalSpent: 149.97,
            createdAt: "2024-04-01",
        },
    ]

    // Filter by search query
    let filtered = allClients
    if (params.searchQuery) {
        filtered = filtered.filter(
            (client) =>
                client.name.toLowerCase().includes(params.searchQuery.toLowerCase()) ||
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
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))
    console.log("Deleting client:", id)
    // In real app, make DELETE request to API
}

export default function AdminClientsPage() {
    const config: DataTableConfig<Client> = {
        title: "Клиенти",
        description: "Управление на клиентските профили и информация",
        columns: [
            {
                key: "name",
                label: "Име",
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
                key: "totalOrders",
                label: "Поръчки",
                render: (value) => <span className="font-medium">{value}</span>,
            },
            {
                key: "totalSpent",
                label: "Общо похарчени",
                render: (value) => <span className="font-semibold text-[var(--knigarela-pink)]">{value.toFixed(2)} лв.</span>,
            },
            {
                key: "createdAt",
                label: "Регистриран на",
                render: (value) => new Date(value).toLocaleDateString("bg-BG"),
            },
        ],
        createUrl: "/admin/clients/new",
        editUrl: (id) => `/admin/clients/${id}`,
        fetchData: fetchClients,
        deleteItem: deleteClient,
        searchPlaceholder: "Търсене по име, имейл или телефон...",
        deleteConfirmation: {
            title: "Изтриване на клиент",
            description: (client) =>
                `Сигурни ли сте, че искате да изтриете клиента ${client.name}? Това действие не може да бъде отменено.`,
        },
    }

    return <DataTable config={config} />
}

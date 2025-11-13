"use client"

import { DataTable } from "@/components/admin/data-table"
import type { DataTableConfig } from "@/components/admin/data-table"

interface Address {
    id: string
    clientName: string
    type: string
    state: string
    address: string
    isDefault: boolean
    createdAt: string
}

// Mock API function - replace with real API calls
async function fetchAddresses(params: {
    searchQuery: string
    filterValue: string
    sortColumn: keyof Address
    sortDirection: "asc" | "desc"
    page: number
    itemsPerPage: number
}) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Mock data
    const allAddresses: Address[] = [
        {
            id: "1",
            clientName: "Иван Петров",
            type: "Личен",
            state: "София",
            address: "ул. Витоша 15, ап. 5",
            isDefault: true,
            createdAt: "2024-01-15",
        },
        {
            id: "2",
            clientName: "Иван Петров",
            type: "Куриер",
            state: "София",
            address: "Офис Еконт - ж.к. Младост 1",
            isDefault: false,
            createdAt: "2024-02-10",
        },
        {
            id: "3",
            clientName: "Мария Георгиева",
            type: "Личен",
            state: "Пловдив",
            address: "бул. Русия 45, вх. Б, ап. 12",
            isDefault: true,
            createdAt: "2024-02-20",
        },
        {
            id: "4",
            clientName: "Георги Димитров",
            type: "Куриер",
            state: "Варна",
            address: "Офис Спиди - бул. Приморски 100",
            isDefault: true,
            createdAt: "2024-03-10",
        },
        {
            id: "5",
            clientName: "Елена Иванова",
            type: "Личен",
            state: "Бургас",
            address: "ул. Александровска 23",
            isDefault: true,
            createdAt: "2023-12-05",
        },
        {
            id: "6",
            clientName: "Елена Иванова",
            type: "Куриер",
            state: "Бургас",
            address: "Офис Еконт - Център",
            isDefault: false,
            createdAt: "2024-01-20",
        },
        {
            id: "7",
            clientName: "Петър Стоянов",
            type: "Личен",
            state: "Стара Загора",
            address: "ж.к. Три Чучура, бл. 25, вх. А, ап. 8",
            isDefault: true,
            createdAt: "2024-04-01",
        },
    ]

    // Filter by search query
    let filtered = allAddresses
    if (params.searchQuery) {
        filtered = filtered.filter(
            (address) =>
                address.clientName.toLowerCase().includes(params.searchQuery.toLowerCase()) ||
                address.state.toLowerCase().includes(params.searchQuery.toLowerCase()) ||
                address.address.toLowerCase().includes(params.searchQuery.toLowerCase())
        )
    }

    // Filter by type
    if (params.filterValue !== "all") {
        filtered = filtered.filter((address) => address.type.toLowerCase() === params.filterValue)
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

async function deleteAddress(id: string) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))
    console.log("Deleting address:", id)
    // In real app, make DELETE request to API
}

export default function AdminAddressesPage() {
    const config: DataTableConfig<Address> = {
        title: "Адреси на клиенти",
        description: "Управление на адресите за доставка на клиентите",
        columns: [
            {
                key: "clientName",
                label: "Клиент",
            },
            {
                key: "type",
                label: "Тип",
                render: (value) => (
                    <span
                        className="rounded-full px-3 py-1 text-sm font-medium"
                        style={{
                            backgroundColor: value === "Личен" ? "var(--knigarela-pink-light)" : "#e0f2fe",
                            color: value === "Личен" ? "var(--knigarela-pink)" : "#0369a1",
                        }}
                    >
                        {value}
                    </span>
                ),
            },
            {
                key: "state",
                label: "Област",
            },
            {
                key: "address",
                label: "Адрес",
            },
            {
                key: "isDefault",
                label: "По подразбиране",
                render: (value) => (
                    <span className={value ? "text-green-600 font-medium" : "text-gray-400"}>
                        {value ? "Да" : "Не"}
                    </span>
                ),
            },
            {
                key: "createdAt",
                label: "Създаден на",
                render: (value) => new Date(value).toLocaleDateString("bg-BG"),
            },
        ],
        createUrl: "/admin/addresses/new",
        editUrl: (id) => `/admin/addresses/${id}`,
        fetchData: fetchAddresses,
        deleteItem: deleteAddress,
        searchPlaceholder: "Търсене по клиент, област или адрес...",
        filterOptions: [
            { label: "Всички типове", value: "all" },
            { label: "Личен", value: "личен" },
            { label: "Куриер", value: "куриер" },
        ],
        filterLabel: "Тип адрес",
        deleteConfirmation: {
            title: "Изтриване на адрес",
            description: (address) =>
                `Сигурни ли сте, че искате да изтриете адреса "${address.address}" за клиент ${address.clientName}? Това действие не може да бъде отменено.`,
        },
    }

    return <DataTable config={config} />
}

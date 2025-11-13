"use client"

import { DataTable, type DataTableConfig } from "@/components/admin/data-table"
import { Badge } from "@/components/ui/badge"

interface Order {
    id: string
    orderNumber: string
    customerName: string
    status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
    total: number
    date: string
}

const fetchOrders = async (params: {
    searchQuery: string
    filterValue: string
    sortColumn: keyof Order
    sortDirection: "asc" | "desc"
    page: number
    itemsPerPage: number
}) => {
    await new Promise((resolve) => setTimeout(resolve, 500))

    const mockOrders: Order[] = [
        {
            id: "1",
            orderNumber: "ORD-2024-001",
            customerName: "Иван Иванов",
            status: "delivered",
            total: 49.99,
            date: "2024-01-15",
        },
        {
            id: "2",
            orderNumber: "ORD-2024-002",
            customerName: "Мария Петрова",
            status: "shipped",
            total: 44.99,
            date: "2024-01-16",
        },
        {
            id: "3",
            orderNumber: "ORD-2024-003",
            customerName: "Георги Георгиев",
            status: "processing",
            total: 59.99,
            date: "2024-01-17",
        },
        {
            id: "4",
            orderNumber: "ORD-2024-004",
            customerName: "Елена Димитрова",
            status: "pending",
            total: 49.99,
            date: "2024-01-18",
        },
        {
            id: "5",
            orderNumber: "ORD-2024-005",
            customerName: "Николай Стоянов",
            status: "cancelled",
            total: 44.99,
            date: "2024-01-19",
        },
    ]

    const filteredOrders = mockOrders.filter((order) => {
        const matchesSearch =
            order.orderNumber.toLowerCase().includes(params.searchQuery.toLowerCase()) ||
            order.customerName.toLowerCase().includes(params.searchQuery.toLowerCase())
        const matchesStatus = params.filterValue === "all" || order.status === params.filterValue
        return matchesSearch && matchesStatus
    })

    filteredOrders.sort((a, b) => {
        const aValue = a[params.sortColumn]
        const bValue = b[params.sortColumn]
        if (aValue < bValue) return params.sortDirection === "asc" ? -1 : 1
        if (aValue > bValue) return params.sortDirection === "asc" ? 1 : -1
        return 0
    })

    const total = filteredOrders.length
    const startIndex = (params.page - 1) * params.itemsPerPage
    const paginatedOrders = filteredOrders.slice(startIndex, startIndex + params.itemsPerPage)

    return { data: paginatedOrders, total }
}

export default function AdminOrdersPage() {
    const statusColors = {
        pending: "bg-yellow-100 text-yellow-700 border-yellow-300",
        processing: "bg-blue-100 text-blue-700 border-blue-300",
        shipped: "bg-purple-100 text-purple-700 border-purple-300",
        delivered: "bg-green-100 text-green-700 border-green-300",
        cancelled: "bg-red-100 text-red-700 border-red-300",
    }

    const statusLabels = {
        pending: "Чакащ",
        processing: "Обработва се",
        shipped: "Изпратен",
        delivered: "Доставен",
        cancelled: "Отменен",
    }

    const config: DataTableConfig<Order> = {
        title: "Управление на Поръчки",
        description: "Преглед и управление на всички поръчки",
        columns: [
            {
                key: "orderNumber",
                label: "Номер",
                render: (value) => <span className="font-medium text-[var(--knigarela-text)]">{value}</span>,
            },
            {
                key: "customerName",
                label: "Клиент",
            },
            {
                key: "status",
                label: "Статус",
                render: (value: keyof typeof statusLabels) => (
                    <Badge className={statusColors[value]}>{statusLabels[value]}</Badge>
                ),
            },
            {
                key: "total",
                label: "Общо",
                render: (value) => `${value.toFixed(2)} лв.`,
            },
            {
                key: "date",
                label: "Дата",
            },
        ],
        createUrl: "/admin/orders/create",
        editUrl: (id) => `/admin/orders/${id}`,
        fetchData: fetchOrders,
        searchPlaceholder: "Търсене по номер или клиент...",
        filterOptions: [
            { label: "Всички", value: "all" },
            { label: "Чакащи", value: "pending" },
            { label: "Обработват се", value: "processing" },
            { label: "Изпратени", value: "shipped" },
            { label: "Доставени", value: "delivered" },
            { label: "Отменени", value: "cancelled" },
        ],
        enableDelete: false,
    }

    return <DataTable config={config} />
}

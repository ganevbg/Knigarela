"use client"

import { DataTable, type DataTableConfig } from "@/components/admin/data-table"
import { Badge } from "@/components/ui/badge"
import { Order } from "@/types/api"
import { getOrders } from "@/api/orders"
import { formatPrice } from "@/lib/utils"

const fetchOrders = async (params: {
    searchQuery: string
    filterValue: string
    sortColumn: keyof Order
    sortDirection: "asc" | "desc"
    page: number
    itemsPerPage: number
}) => {

    const result = await getOrders(params);

    return {
        data: result.data,
        total: result.total,
    };
}

export default function AdminOrdersPage() {
    const statusColors = {
        new: "bg-yellow-100 text-yellow-700 border-yellow-300",
        processing: "bg-blue-100 text-blue-700 border-blue-300",
        shipped: "bg-purple-100 text-purple-700 border-purple-300",
        delivered: "bg-green-100 text-green-700 border-green-300",
        cancelled: "bg-red-100 text-red-700 border-red-300",
    }

    const statusLabels = {
        new: "Нов",
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
                key: "clientName",
                label: "Клиент",
            },
            {
                key: "address",
                label: "адрес",
            },
            {
                key: "status",
                label: "Статус",
                render: (value: keyof typeof statusLabels) => (
                    <Badge className={statusColors[value]}>{statusLabels[value]}</Badge>
                ),
            },
            {
                key: "totalAmount",
                label: "Общо",
                render: (value) => formatPrice(value, true),
            },
            {
                key: "date",
                label: "Дата",
                render: (value) => <span className="font-semibold text-[var(--knigarela-pink)]">{value ? new Date(value).toLocaleDateString("bg-BG") : ""}</span>,
            },
        ],
        createUrl: "/admin/order/create",
        editUrl: (id) => `/admin/order/${id}`,
        fetchData: fetchOrders,
        searchPlaceholder: "Търсене по номер или клиент...",
        filterOptions: [
            { label: "Всички", value: "all" },
            { label: "Нов", value: "new" },
            { label: "Обработват се", value: "processing" },
            { label: "Изпратен", value: "shipped" },
            { label: "Доставен", value: "delivered" },
            { label: "Отменен", value: "cancelled" },
        ],
        enableDelete: false,
    }

    return <DataTable config={config} />
}

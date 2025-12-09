"use client"

import { DataTable, type DataTableConfig } from "@/components/admin/data-table"
import { Badge } from "@/components/ui/badge"
import { Order } from "@/types/api"
import { getOrders, deleteOrder, createRequestsForNewOrders, getJobStatus } from "@/api/orders"
import { formatPrice } from "@/lib/utils"
import { PaginationParams } from "@/types/common/PaginationParams"
import { useState } from "react"
import { JobStatus } from "@/components/job-status";
import { Bus } from 'lucide-react'

const fetchOrders = async (params: PaginationParams<keyof Order>) => {

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

    const [reloadKey, setReloadKey] = useState(0);
    const [jobId, setJobId] = useState<string | null>(null);

    async function createRequests() {

        const jobId = await createRequestsForNewOrders();
        setJobId(jobId);
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
                key: "speedyId",
                label: "Номер на товарителница",
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
        createUrl: "/admin/orders/create",
        editUrl: (id) => `/admin/orders/${id}`,
        fetchData: fetchOrders,
        filters: [
            {
                key: "number",
                label: "Номер",
                type: "text",
                placeholder: "Търсене по номер...",
            },
            {
                key: "clientName",
                label: "Клиент",
                type: "text",
                placeholder: "Търсене по клиент...",
            },
            {
                key: "status",
                label: "Статус",
                type: "select",
                defaultValue: "all",
                options: [
                    { label: "Всички", value: "all" },
                    { label: "Нов", value: "new" },
                    { label: "Обработват се", value: "processing" },
                    { label: "Изпратен", value: "shipped" },
                    { label: "Доставен", value: "delivered" },
                    { label: "Отменен", value: "cancelled" },
                ],
            },
        ],
        deleteItem: deleteOrder,
        deleteConfirmation: {
            title: "Изтриване на поръчка",
            description: (order) =>
                `Сигурни ли сте, че искате да изтриете поръчка с номер "${order.orderNumber}"? Това действие не може да бъде отменено.`,
        },
        massCustomActions: [
            {
                icon: Bus,
                onClick: () => createRequests(),
                label: "Направи товарителници"
            }
        ]
    }

    return <>
        {
            jobId && (
                <div className="p-4">
                    <JobStatus
                        jobId={jobId}
                        statusUrl="/api/order/job-status"
                        onDone={() => setReloadKey(v => v + 1)}
                        onClose={() => setJobId(null)}
                    />
                </div>
            )
        }

        <DataTable config={config} reloadKey={reloadKey} />
    </>
}

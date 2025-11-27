"use client"

import { DataTable, type DataTableConfig } from "@/components/admin/data-table"
import { Badge } from "@/components/ui/badge"
import { getAllAdmin, deleteBox } from "@/api/boxes"
import { Box } from "@/types/api/Box"
import { PaginationParams } from "@/types/common/PaginationParams"
import { formatPrice } from "@/lib/utils";

const fetchBoxes = async (params: PaginationParams<keyof Box>) => {
    const result = await getAllAdmin(params);

    return {
        data: result.data,
        total: result.total,
    };
}

export default function AdminBoxesPage() {
    const config: DataTableConfig<Box> = {
        title: "Управление на Кутии",
        description: "Създавайте и управлявайте вашите книжни колекции",
        columns: [
            {
                key: "title",
                label: "Заглавие",
                render: (value) => <span className="font-medium text-[var(--knigarela-text)]">{value}</span>,
            },
            {
                key: "isActive",
                label: "Статус",
                render: (value) => (
                    <Badge
                        variant={value ? "default" : "secondary"}
                        className={
                            value
                                ? "bg-[var(--knigarela-pink-light)] text-[var(--knigarela-pink)] border-[var(--knigarela-pink)]"
                                : "bg-gray-100 text-gray-600 border-gray-300"
                        }
                    >
                        {value ? "Активна" : "Неактивна"}
                    </Badge>
                ),
            },
            {
                key: "count",
                label: "Наличност",
                render: (value) => `${value} бр.`,
            },
            {
                key: "singlePrice",
                label: "Единична Цена",
                render: (value) => formatPrice(value, true),
            },
            {
                key: "subscriptionPrice",
                label: "Абонаментна Цена",
                render: (value) => formatPrice(value, true),
            },
        ],
        createUrl: "/admin/boxes/create",
        editUrl: (id) => `/admin/boxes/${id}`,
        fetchData: fetchBoxes,
        deleteItem: deleteBox,
        filters: [
            {
                key: "title",
                label: "Заглавие",
                type: "text",
                placeholder: "Търсене по заглавие...",
            },
            {
                key: "minCount",
                label: "Минимална наличност",
                type: "number",
                placeholder: "Търсене по минимална наличност...",
            },
            {
                key: "status",
                label: "Статус",
                type: "select",
                defaultValue: "all",
                options: [
                    { label: "Всички", value: "all" },
                    { label: "Активна", value: "active" },
                    { label: "Неактивна", value: "inactive" },
                ],
            },
        ],
        deleteConfirmation: {
            title: "Изтриване на кутия",
            description: (box) =>
                `Сигурни ли сте, че искате да изтриете кутията "${box.title}"? Това действие не може да бъде отменено.`,
        },
    }

    return <DataTable config={config} />
}

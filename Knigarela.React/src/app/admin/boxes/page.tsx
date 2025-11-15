"use client"

import { DataTable, type DataTableConfig } from "@/components/admin/data-table"
import { Badge } from "@/components/ui/badge"
import { getAllAdmin, deleteBox } from "@/api/boxes"
import { Box } from "@/types/api/Box"
import { PaginationParams } from "@/types/common/PaginationParams"

const fetchBoxes = async (params: PaginationParams<keyof Box>) => {
    const boxes = await getAllAdmin();

    // Apply filtering
    const filteredBoxes = boxes.filter((box) => {
        const matchesSearch = box.title.toLowerCase().includes(params.searchQuery.toLowerCase())
        const matchesStatus =
            params.filterValue === "all" ||
            (params.filterValue === "active" && box.isActive) ||
            (params.filterValue === "inactive" && !box.isActive)
        return matchesSearch && matchesStatus
    })

    // Apply sorting
    filteredBoxes.sort((a, b) => {
        const aValue = a[params.sortColumn]
        const bValue = b[params.sortColumn]

        if (typeof aValue === "boolean") {
            return params.sortDirection === "asc"
                ? aValue === bValue
                    ? 0
                    : aValue
                        ? 1
                        : -1
                : aValue === bValue
                    ? 0
                    : aValue
                        ? -1
                        : 1
        }

        if (aValue < bValue) return params.sortDirection === "asc" ? -1 : 1
        if (aValue > bValue) return params.sortDirection === "asc" ? 1 : -1
        return 0
    })

    const total = filteredBoxes.length
    const startIndex = (params.page - 1) * params.itemsPerPage
    const paginatedBoxes = filteredBoxes.slice(startIndex, startIndex + params.itemsPerPage)

    return { data: paginatedBoxes, total }
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
                render: (value) => `${value.toFixed(2)} лв.`,
            },
            {
                key: "subscriptionPrice",
                label: "Абонаментна Цена",
                render: (value) => `${value.toFixed(2)} лв.`,
            },
        ],
        createUrl: "/admin/boxes/create",
        editUrl: (id) => `/admin/boxes/${id}`,
        fetchData: fetchBoxes,
        deleteItem: deleteBox,
        searchPlaceholder: "Търсене по име...",
        filterOptions: [
            { label: "Всички", value: "all" },
            { label: "Активни", value: "active" },
            { label: "Неактивни", value: "inactive" },
        ],
        deleteConfirmation: {
            title: "Изтриване на кутия",
            description: (box) =>
                `Сигурни ли сте, че искате да изтриете кутията "${box.title}"? Това действие не може да бъде отменено.`,
        },
    }

    return <DataTable config={config} />
}

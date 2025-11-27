"use client"

import { DataTable } from "@/components/admin/data-table"
import type { DataTableConfig } from "@/components/admin/data-table"
import { getAllClients, deleteClientById } from "@/api/clients"
import { MapPin, Merge } from 'lucide-react'
import type { ClientAllDto } from "@/types/api"
import { PaginationParams } from "@/types/common/PaginationParams"

const fetchClients = async (params: PaginationParams<keyof ClientAllDto>) => {
    const result = await getAllClients(params);

    return {
        data: result.data,
        total: result.total,
    };
}

async function deleteClient(id: string) {
    await deleteClientById(id);
}

async function markNewAsOld() {
    alert("Маркиране на всички нови клиенти като стари...");
}

export default function AdminClientsPage() {
    const config: DataTableConfig<ClientAllDto> = {
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
                key: "isNewSubscriber",
                label: "Нов абонат ли е",
                render: (value) => <span className="font-medium">{value ? "Да" : "Не"}</span>,
            },
        ],
        createUrl: "/admin/clients/create",
        editUrl: (id) => `/admin/clients/${id}`,
        fetchData: fetchClients,
        deleteItem: deleteClient,
        filters: [
            {
                key: "name",
                label: "Име",
                type: "text",
                placeholder: "Търсене по име...",
            },
            {
                key: "email",
                label: "Имейл",
                type: "text",
                placeholder: "Търсене по имейл...",
            },
            {
                key: "phone",
                label: "Телефон",
                type: "text",
                placeholder: "Търсене по телефон...",
            },
            {
                key: "isSubscriber",
                label: "Абонат",
                type: "select",
                defaultValue: "all",
                options: [
                    { label: "Всички", value: "all" },
                    { label: "Да", value: "true" },
                    { label: "Не", value: "false" },
                ],
            },
            {
                key: "isNewSubscriber",
                label: "Нов абонат",
                type: "select",
                defaultValue: "all",
                options: [
                    { label: "Всички", value: "all" },
                    { label: "Да", value: "true" },
                    { label: "Не", value: "false" },
                ],
            },
        ],
        deleteConfirmation: {
            title: "Изтриване на клиент",
            description: (client) =>
                `Сигурни ли сте, че искате да изтриете клиента ${client.fullName}? Това действие не може да бъде отменено.`,
        },
        customActions: [
            {
                icon: MapPin,
                href: (client) => `/admin/clients/${client?.id}/addresses`,
            },
        ],
        massCustomActions: [
            {
                icon: Merge,
                label: "Маркирай всички нови като стари",
                onClick: () => markNewAsOld(),
            },
        ]
    }

    return <DataTable config={config} />
}

"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save } from "lucide-react";
import { getById, create, update } from "@/api/clients";


interface Client {
    id: string
    fullName: string,
    email: string
    phone: string
    subscriptionDate: string
}

export default function AdminClientFormPage() {
    const router = useRouter();
    const params = useParams();
    const isEdit = params.id !== "create";
    const clientId = params.id as string;

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState<Client>({
        id: "",
        fullName: "",
        email: "",
        phone: "",
        subscriptionDate: "",
    });

    useEffect(() => {
        if (isEdit) {
            const loadClient = async () => {
                setLoading(true);
                const data = await getById(clientId);
                setFormData({ ...data });
                setLoading(false);
            };
            loadClient();
        }
    }, [isEdit]);

    const handleInputChange = (field: keyof Client, value: string | boolean) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            let savedClient: Client;
            if (isEdit) {
                savedClient = await update(formData);
            } else {
                savedClient = await create(formData);
                setFormData((prev) => ({ ...prev, id: savedClient.id }));
                router.replace(`/admin/clients/${savedClient.id}`);
            }
            router.push("/admin/clients");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[var(--knigarela-bg)]">
                <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-[var(--knigarela-pink)]"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--knigarela-bg)]">
            {/* Header */}
            <div className="border-b border-gray-200 bg-white">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/clients">
                            <Button variant="outline" size="icon" className="border-gray-300 bg-transparent">
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-[var(--knigarela-text)]">
                                {isEdit ? "Редактиране на Клиент" : "Създаване на Нов Клиент"}
                            </h1>
                            <p className="mt-1 text-[var(--knigarela-text-light)]">
                                {isEdit ? "Актуализирайте информацията за клиент" : "Добавете нов клиент"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="container mx-auto px-4 py-8">
                <div className="mx-auto max-w-4xl space-y-6">
                    {/* Basic Information */}
                    <div className="space-y-6 rounded-lg bg-white p-6 shadow-sm">
                        <h2 className="border-b border-gray-200 pb-3 text-xl font-semibold text-[var(--knigarela-text)]">
                            Основна Информация
                        </h2>

                        {/* FullName */}
                        <div className="space-y-2">
                            <Label htmlFor="fullName" className="text-[var(--knigarela-text)]">
                                Имена <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="fullName"
                                type="text"
                                value={formData.fullName}
                                onChange={(e) => handleInputChange("fullName", e.target.value)}
                                placeholder="Въведете имената на клиента"
                                required
                                className="border-gray-300"
                            />
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-[var(--knigarela-text)]">
                                Електронна поща <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="email"
                                value={formData.email}
                                onChange={(e) => handleInputChange("email", e.target.value)}
                                placeholder="Въведете електронна поща на клиента"
                                required
                                className="border-gray-300 resize-none"
                            />
                        </div>

                        {/* Phone */}
                        <div className="space-y-2">
                            <Label htmlFor="phone" className="text-[var(--knigarela-text)]">
                                Телефон <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="phone"
                                value={formData.phone}
                                onChange={(e) => handleInputChange("phone", e.target.value)}
                                placeholder="Въведете телефон на клиента"
                                required
                                className="border-gray-300 resize-none"
                            />
                        </div>

                        {/* SubscriptionDate */}
                        <div className="space-y-2">
                            <Label htmlFor="subscriptionDate" className="text-[var(--knigarela-text)]">
                                Дата на абониране
                            </Label>
                            <Input
                                id="subscriptionDate"
                                type="date"
                                value={formData.subscriptionDate?.slice(0, 10) || ""}
                                onChange={(e) => handleInputChange("subscriptionDate", e.target.value)}
                                placeholder="Въведете дата на абониране на клиента"
                                className="border-gray-300 resize-none"
                            />
                        </div>


                    </div>

                    {/* Buttons */}
                    <div className="flex items-center justify-end gap-4 pt-4">
                        <Link href="/admin/clients">
                            <Button type="button" variant="outline" className="border-gray-300 bg-transparent">
                                Отказ
                            </Button>
                        </Link>
                        <Button
                            type="submit"
                            disabled={saving}
                            className="min-w-32 bg-[var(--knigarela-pink)] text-white hover:bg-[var(--knigarela-pink)]/90"
                        >
                            {saving ? (
                                <div className="flex items-center gap-2">
                                    <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                                    <span>Записване...</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Save className="h-4 w-4" />
                                    <span>{isEdit ? "Запазване" : "Създаване"}</span>
                                </div>
                            )}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}

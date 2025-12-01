"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import AddressPicker from "@/components/address/AddressPicker"
import { ArrowLeft, Save } from "lucide-react";
import { getClientAddressById, createClientAddress, updateClientAddress } from "@/api/clients";
import { Checkbox } from "@/components/ui/checkbox";
import { ClientAddress } from "@/types/api"

export default function AdminClientAddressFormPage() {
    const router = useRouter();
    const params = useParams();
    const isEdit = params.addressId !== "create";
    const clientId = params.id as string;
    const id = params.addressId as string;

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState<ClientAddress>({
        id: "",
        siteId: "",
        siteName: "",
        officeId: "",
        officeName: "",
        addressText: "",
        deliveryType: "courier",
        isDefault: false,
    });

    useEffect(() => {
        if (isEdit) {
            const loadAddress = async () => {
                setLoading(true);
                const data = await getClientAddressById(clientId, id);
                setFormData({ ...data });
                setLoading(false);
            };
            loadAddress();
        }
    }, [isEdit]);

    const handleInputChange = (field: keyof ClientAddress, value: string | boolean) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            let savedAddress: ClientAddress;
            if (isEdit) {
                savedAddress = await updateClientAddress(clientId, formData);
            } else {
                savedAddress = await createClientAddress(clientId, formData);
                setFormData((prev) => ({ ...prev, id: savedAddress.id }));
                router.replace(`/admin/clients/${clientId}/addresses/${savedAddress.id}`);
            }
            router.push(`/admin/clients/${clientId}/addresses`);
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
                        <Link href={ `/admin/clients/${clientId}/addresses` }>
                            <Button variant="outline" size="icon" className="border-gray-300 bg-transparent">
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-[var(--knigarela-text)]">
                                {isEdit ? "Редактиране на Адрес на клиент" : "Създаване на Нов Аднрес на клиент"}
                            </h1>
                            <p className="mt-1 text-[var(--knigarela-text-light)]">
                                {isEdit ? "Актуализирайте информацията за адрес на клиент" : "Добавете нов адрес на клиент"}
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

                        <div className="space-y-4">
                            <AddressPicker
                                value={{
                                    siteId: formData.siteId || null,
                                    siteName: formData.siteName,
                                    officeId: formData.officeId || null,
                                    officeName: formData.officeName,
                                    addressText: formData.addressText,
                                    deliveryType: formData.deliveryType,
                                }}
                                onChange={(partial) => setFormData(prev => ({ ...prev, ...partial }))}
                            />
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="isDefault"
                                    checked={formData.isDefault}
                                    onCheckedChange={(checked) => handleInputChange("isDefault", checked as boolean)}
                                    className="border-[var(--knigarela-pink)] data-[state=checked]:bg-[var(--knigarela-pink)] data-[state=checked]:text-white"
                                />
                                <Label htmlFor="isDefault" className="cursor-pointer text-[var(--knigarela-text)]">
                                    По подразбиране
                                </Label>
                            </div>
                        </div>

                    </div>

                    {/* Buttons */}
                    <div className="flex items-center justify-end gap-4 pt-4">
                        <Link href={ `/admin/clients/${clientId}/addresses`}>
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

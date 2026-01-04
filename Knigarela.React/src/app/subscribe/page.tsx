"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import AddressPicker from "@/components/address/AddressPicker"
import { useRouter } from "next/navigation";
import { Checkout } from "@/types/api"
import { subscribe } from "@/api/clients"
import { toast } from "react-toastify";


export default function CheckoutPage() {
    const router = useRouter();

    const [formData, setFormData] = useState<Checkout>({
        name: "",
        email: "",
        phone: "",
        address: {
            id: "",
            deliveryType: "courier",
            siteId: null,
            siteName: "",
            addressText: "",
            officeId: null,
            officeName: "",
            isDefault: true,
        },
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const data = await subscribe(formData);

        toast.success("Абонирахте се успешно!");
        router.push(`/`);
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    return (
        <>
            <div className="mx-auto max-w-4xl py-2">
                <div className="mb-12">
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="rounded-lg bg-white p-6 shadow-md">
                            <h2 className="mb-6 text-2xl font-semibold" style={{ color: "var(--knigarela-pink)" }}>
                                        Контактна информация
                                    </h2>
                                    <div className="space-y-4">
                                        <div>
                                            <label htmlFor="name" className="mb-2 block text-sm font-medium" style={{ color: "#2d2d2d" }}>
                                                Име *
                                            </label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                required
                                                value={formData.name}
                                                onChange={handleChange}
                                                className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-all focus:ring-2 focus:outline-none"
                                                style={{ "--tw-ring-color": "#D176A3" } as React.CSSProperties}
                                            />
                                        </div>
                                        <div className="grid gap-4 md:grid-cols-2">
                                            <div>
                                                <label
                                                    htmlFor="email"
                                                    className="mb-2 block text-sm font-medium"
                                                    style={{ color: "#2d2d2d" }}
                                                >
                                                    Email *
                                                </label>
                                                <input
                                                    type="email"
                                                    id="email"
                                                    name="email"
                                                    required
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-all focus:ring-2 focus:outline-none"
                                                    style={{ "--tw-ring-color": "#D176A3" } as React.CSSProperties}
                                                />
                                            </div>
                                            <div>
                                                <label
                                                    htmlFor="phone"
                                                    className="mb-2 block text-sm font-medium"
                                                    style={{ color: "#2d2d2d" }}
                                                >
                                                    Телефон *
                                                </label>
                                                <input
                                                    type="tel"
                                                    id="phone"
                                                    name="phone"
                                                    required
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-all focus:ring-2 focus:outline-none"
                                                    style={{ "--tw-ring-color": "#D176A3" } as React.CSSProperties}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-lg bg-white p-6 shadow-md">
                            <h2 className="mb-6 text-2xl font-semibold" style={{ color: "var(--knigarela-pink)" }}>
                                        Адрес за доставка
                                    </h2>
                                    <div className="space-y-4">
                                        <AddressPicker
                                            value={{
                                                siteId: formData.address.siteId || null,
                                                siteName: formData.address.siteName,
                                                officeId: formData.address.officeId || null,
                                                officeName: formData.address.officeName,
                                                addressText: formData.address.addressText,
                                                deliveryType: formData.address.deliveryType,
                                            }}
                                            onChange={(partial) =>
                                                setFormData(prev => ({
                                                    ...prev,
                                                    address: {
                                                        ...prev.address,
                                                        ...partial,
                                                    },
                                                }))
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-4 sm:flex-row">
                                    <Button
                                        type="submit"
                                        size="lg"
                                        className="flex-1 rounded-full px-8 py-6 text-base font-medium text-white shadow-md transition-all duration-300 hover:shadow-lg"
                                        style={{ backgroundColor: "#D176A3" }}
                                    >
                                        Абонирай се
                                    </Button>
                                </div>
                            </form>
                </div>
            </div>
        </>
    )
}

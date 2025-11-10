"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import Link from "next/link"
import { getOffices, getSites } from "@/api/speedy"
export default function CheckoutPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        addressType: "courier" as "personal" | "courier",
        state: "",
        address: "",
        office: "",
    })

    const [stateQuery, setStateQuery] = useState("")
    const [officeQuery, setOfficeQuery] = useState("")
    const [stateResults, setStateResults] = useState<Array<{ id: string; name: string }>>([])
    const [officeResults, setOfficeResults] = useState<Array<{ id: string; name: string }>>([])
    const [showStateResults, setShowStateResults] = useState(false)
    const [showOfficeResults, setShowOfficeResults] = useState(false)

    const cartItems = [
        {
            id: 1,
            title: "Зимни приказки",
            price: 49.99,
            quantity: 1,
            month: "Януари 2025",
        },
    ]

    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const shipping = 5.99
    const total = subtotal + shipping

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log("Order submitted:", formData)
        // Handle checkout logic here
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    const handleStateSearch = async (query: string) => {
        setStateQuery(query)
        if (query.length < 3) {
            setStateResults([])
            setShowStateResults(false)
            return
        }

        setStateResults(await getSites(query));
        setShowStateResults(true)
    }

    const handleOfficeSearch = async (query: string) => {
        setOfficeQuery(query)
        if (query.length < 3) {
            setOfficeResults([])
            setShowOfficeResults(false)
            return
        }

        setOfficeResults(await getOffices(query));
        setShowOfficeResults(true);
    }

    const selectState = (state: { id: string; name: string }) => {
        setFormData({ ...formData, state: state.name })
        setStateQuery(state.name)
        setShowStateResults(false)
    }

    const selectOffice = (office: { id: string; name: string }) => {
        setFormData({ ...formData, office: office.name })
        setOfficeQuery(office.name)
        setShowOfficeResults(false)
    }

    return (
        <>
            {/* Checkout Content */}
            <section className="w-full px-4 py-16">
                <div className="mx-auto max-w-7xl">
                    <div className="grid gap-8 lg:grid-cols-3">
                        {/* Checkout Form */}
                        <div className="lg:col-span-2">
                            <form onSubmit={handleSubmit} className="space-y-8">
                                {/* Contact Information */}
                                <div className="rounded-lg bg-white p-6 shadow-md">
                                    <h2 className="mb-6 text-2xl font-semibold" style={{ color: "#2d2d2d" }}>
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
                                                placeholder="Вашето пълно име"
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

                                {/* Shipping Address */}
                                <div className="rounded-lg bg-white p-6 shadow-md">
                                    <h2 className="mb-6 text-2xl font-semibold" style={{ color: "#2d2d2d" }}>
                                        Адрес за доставка
                                    </h2>
                                    <div className="space-y-4">
                                        <div>
                                            <label
                                                htmlFor="addressType"
                                                className="mb-2 block text-sm font-medium"
                                                style={{ color: "#2d2d2d" }}
                                            >
                                                Тип адрес *
                                            </label>
                                            <select
                                                id="addressType"
                                                name="addressType"
                                                required
                                                value={formData.addressType}
                                                onChange={handleChange}
                                                className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-all focus:ring-2 focus:outline-none"
                                                style={{ "--tw-ring-color": "#D176A3" } as React.CSSProperties}
                                            >
                                                <option value="personal">Личен адрес</option>
                                                <option value="courier">Офис на куриер</option>
                                            </select>
                                        </div>

                                        {formData.addressType === "personal" ? (
                                            <>
                                                {/* State Autocomplete */}
                                                <div className="relative">
                                                    <label
                                                        htmlFor="state"
                                                        className="mb-2 block text-sm font-medium"
                                                        style={{ color: "#2d2d2d" }}
                                                    >
                                                        Населено място *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="state"
                                                        name="state"
                                                        required
                                                        value={stateQuery}
                                                        onChange={(e) => handleStateSearch(e.target.value)}
                                                        onFocus={() => stateQuery.length >= 2 && setShowStateResults(true)}
                                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 transition-all"
                                                        style={{ "--tw-ring-color": "#D176A3" } as React.CSSProperties}
                                                        placeholder="Започнете да пишете..."
                                                        autoComplete="off"
                                                    />
                                                    {showStateResults && stateResults.length > 0 && (
                                                        <div className="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border border-gray-300 bg-white shadow-lg">
                                                            {stateResults.map((state) => (
                                                                <button
                                                                    key={state.id}
                                                                    type="button"
                                                                    onClick={() => selectState(state)}
                                                                    className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors"
                                                                    style={{ color: "#2d2d2d" }}
                                                                >
                                                                    {state.name}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Address Text Input */}
                                                <div>
                                                    <label
                                                        htmlFor="address"
                                                        className="mb-2 block text-sm font-medium"
                                                        style={{ color: "#2d2d2d" }}
                                                    >
                                                        Адрес *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="address"
                                                        name="address"
                                                        required
                                                        value={formData.address}
                                                        onChange={handleChange}
                                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-all focus:ring-2 focus:outline-none"
                                                        style={{ "--tw-ring-color": "#D176A3" } as React.CSSProperties}
                                                        placeholder="Улица, номер, етаж, апартамент"
                                                    />
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                {/* Office Autocomplete */}
                                                <div className="relative">
                                                    <label
                                                        htmlFor="office"
                                                        className="mb-2 block text-sm font-medium"
                                                        style={{ color: "#2d2d2d" }}
                                                    >
                                                        Офис на куриер *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="office"
                                                        name="office"
                                                        required
                                                        value={officeQuery}
                                                        onChange={(e) => handleOfficeSearch(e.target.value)}
                                                        onFocus={() => officeQuery.length >= 2 && setShowOfficeResults(true)}
                                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 transition-all"
                                                        style={{ "--tw-ring-color": "#D176A3" } as React.CSSProperties}
                                                        placeholder="Започнете да пишете име на офис..."
                                                        autoComplete="off"
                                                    />
                                                    {showOfficeResults && officeResults.length > 0 && (
                                                        <div className="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border border-gray-300 bg-white shadow-lg">
                                                            {officeResults.map((office) => (
                                                                <button
                                                                    key={office.id}
                                                                    type="button"
                                                                    onClick={() => selectOffice(office)}
                                                                    className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors"
                                                                    style={{ color: "#2d2d2d" }}
                                                                >
                                                                    {office.name}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Payment Method */}
                                <div className="rounded-lg bg-white p-6 shadow-md">
                                    <h2 className="mb-6 text-2xl font-semibold" style={{ color: "#2d2d2d" }}>
                                        Метод на плащане
                                    </h2>
                                    <RadioGroup defaultValue="cod">
                                        <div
                                            className="flex cursor-pointer items-center space-x-3 rounded-lg border-2 p-4 transition-all"
                                            style={{
                                                borderColor: "#D176A3",
                                                backgroundColor: "#fff5fa",
                                            }}
                                        >
                                            <RadioGroupItem value="cod" id="cod" style={{ borderColor: "#D176A3" }} />
                                            <Label htmlFor="cod" className="flex-1 cursor-pointer">
                                                <div>
                                                    <p className="font-medium" style={{ color: "#2d2d2d" }}>
                                                        Наложен платеж (COD)
                                                    </p>
                                                    <p className="text-sm" style={{ color: "#6b6b6b" }}>
                                                        Плащане в брой или с карта при доставка
                                                    </p>
                                                </div>
                                            </Label>
                                        </div>
                                    </RadioGroup>
                                </div>

                                {/* Submit Buttons */}
                                <div className="flex flex-col gap-4 sm:flex-row">
                                    <Button
                                        type="submit"
                                        size="lg"
                                        className="flex-1 rounded-full px-8 py-6 text-base font-medium text-white shadow-md transition-all duration-300 hover:shadow-lg"
                                        style={{ backgroundColor: "#D176A3" }}
                                    >
                                        Завърши поръчката
                                    </Button>
                                    <Link href="/cart" className="flex-1">
                                        <Button
                                            type="button"
                                            size="lg"
                                            variant="outline"
                                            className="w-full rounded-full border-2 bg-transparent px-8 py-6 text-base font-medium transition-all duration-300"
                                            style={{
                                                borderColor: "#D176A3",
                                                color: "#D176A3",
                                            }}
                                        >
                                            Обратно към количката
                                        </Button>
                                    </Link>
                                </div>
                            </form>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-24 rounded-lg p-6 shadow-md" style={{ backgroundColor: "#ffcfe7" }}>
                                <h2 className="mb-6 text-2xl font-semibold" style={{ color: "#2d2d2d" }}>
                                    Вашата поръчка
                                </h2>

                                {/* Cart Items */}
                                <div className="mb-6 space-y-4">
                                    {cartItems.map((item) => (
                                        <div key={item.id} className="flex gap-3">
                                            <div className="flex-1">
                                                <h4 className="mb-1 text-sm font-medium" style={{ color: "#2d2d2d" }}>
                                                    {item.title}
                                                </h4>
                                                <p className="text-xs" style={{ color: "#6b6b6b" }}>
                                                    {item.month}
                                                </p>
                                                <p className="text-xs" style={{ color: "#6b6b6b" }}>
                                                    Количество: {item.quantity}
                                                </p>
                                            </div>
                                            <p className="font-semibold" style={{ color: "#D176A3" }}>
                                                {item.price.toFixed(2)} лв
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                {/* Price Summary */}
                                <div className="space-y-3 border-t border-gray-300 pt-4">
                                    <div className="flex justify-between text-gray-700">
                                        <span>Междинна сума:</span>
                                        <span>{subtotal.toFixed(2)} лв</span>
                                    </div>
                                    <div className="flex justify-between text-gray-700">
                                        <span>Доставка:</span>
                                        <span>{shipping.toFixed(2)} лв</span>
                                    </div>
                                    <div
                                        className="flex justify-between border-t border-gray-300 pt-3 text-xl font-semibold"
                                        style={{ color: "#2d2d2d" }}
                                    >
                                        <span>Общо:</span>
                                        <span style={{ color: "#D176A3" }}>{total.toFixed(2)} лв</span>
                                    </div>
                                </div>

                                {/* Security Notice */}
                                <div className="mt-6 rounded-lg bg-white p-4">
                                    <div className="flex items-start gap-2">
                                        <svg
                                            className="mt-0.5 h-5 w-5 flex-shrink-0"
                                            style={{ color: "#D176A3" }}
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                            />
                                        </svg>
                                        <div>
                                            <p className="mb-1 text-sm font-medium" style={{ color: "#2d2d2d" }}>
                                                Сигурно плащане
                                            </p>
                                            <p className="text-xs" style={{ color: "#6b6b6b" }}>
                                                Вашите данни са защитени с SSL криптиране
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

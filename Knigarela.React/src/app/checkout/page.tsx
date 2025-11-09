"use client"

import type React from "react"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Header } from "@/components/header"
    
export default function CheckoutPage() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        postalCode: "",
        country: "България",
    })

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

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-white">
                {/* Header */}
                <Header />

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
                                        <div className="grid gap-4 md:grid-cols-2">
                                            <div>
                                                <label
                                                    htmlFor="firstName"
                                                    className="mb-2 block text-sm font-medium"
                                                    style={{ color: "#2d2d2d" }}
                                                >
                                                    Име *
                                                </label>
                                                <input
                                                    type="text"
                                                    id="firstName"
                                                    name="firstName"
                                                    required
                                                    value={formData.firstName}
                                                    onChange={handleChange}
                                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-all focus:ring-2 focus:outline-none"
                                                    style={{ "--tw-ring-color": "#D176A3" } as React.CSSProperties}
                                                />
                                            </div>
                                            <div>
                                                <label
                                                    htmlFor="lastName"
                                                    className="mb-2 block text-sm font-medium"
                                                    style={{ color: "#2d2d2d" }}
                                                >
                                                    Фамилия *
                                                </label>
                                                <input
                                                    type="text"
                                                    id="lastName"
                                                    name="lastName"
                                                    required
                                                    value={formData.lastName}
                                                    onChange={handleChange}
                                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-all focus:ring-2 focus:outline-none"
                                                    style={{ "--tw-ring-color": "#D176A3" } as React.CSSProperties}
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="email" className="mb-2 block text-sm font-medium" style={{ color: "#2d2d2d" }}>
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
                                                <label htmlFor="phone" className="mb-2 block text-sm font-medium" style={{ color: "#2d2d2d" }}>
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

                                    {/* Shipping Address */}
                                    <div className="rounded-lg bg-white p-6 shadow-md">
                                        <h2 className="mb-6 text-2xl font-semibold" style={{ color: "#2d2d2d" }}>
                                            Адрес за доставка
                                        </h2>
                                        <div className="space-y-4">
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
                                                    placeholder="Улица, номер, етаж"
                                                />
                                            </div>
                                            <div className="grid gap-4 md:grid-cols-2">
                                                <div>
                                                    <label htmlFor="city" className="mb-2 block text-sm font-medium" style={{ color: "#2d2d2d" }}>
                                                        Град *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="city"
                                                        name="city"
                                                        required
                                                        value={formData.city}
                                                        onChange={handleChange}
                                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-all focus:ring-2 focus:outline-none"
                                                        style={{ "--tw-ring-color": "#D176A3" } as React.CSSProperties}
                                                    />
                                                </div>
                                                <div>
                                                    <label
                                                        htmlFor="postalCode"
                                                        className="mb-2 block text-sm font-medium"
                                                        style={{ color: "#2d2d2d" }}
                                                    >
                                                        Пощенски код *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="postalCode"
                                                        name="postalCode"
                                                        required
                                                        value={formData.postalCode}
                                                        onChange={handleChange}
                                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-all focus:ring-2 focus:outline-none"
                                                        style={{ "--tw-ring-color": "#D176A3" } as React.CSSProperties}
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label
                                                    htmlFor="country"
                                                    className="mb-2 block text-sm font-medium"
                                                    style={{ color: "#2d2d2d" }}
                                                >
                                                    Държава *
                                                </label>
                                                <select
                                                    id="country"
                                                    name="country"
                                                    required
                                                    value={formData.country}
                                                    onChange={handleChange}
                                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-all focus:ring-2 focus:outline-none"
                                                    style={{ "--tw-ring-color": "#D176A3" } as React.CSSProperties}
                                                >
                                                    <option value="България">България</option>
                                                    <option value="Румъния">Румъния</option>
                                                    <option value="Гърция">Гърция</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Payment Method */}
                                    <div className="rounded-lg bg-white p-6 shadow-md">
                                        <h2 className="mb-6 text-2xl font-semibold" style={{ color: "#2d2d2d" }}>
                                            Метод на плащане
                                        </h2>
                                        <div className="space-y-4">
                                            <label className="flex cursor-pointer items-center gap-3 rounded-lg border-2 p-4 transition-colors hover:bg-gray-50">
                                                <input type="radio" name="payment" value="card" defaultChecked className="h-5 w-5" />
                                                <div className="flex-1">
                                                    <p className="font-medium" style={{ color: "#2d2d2d" }}>
                                                        Кредитна / Дебитна карта
                                                    </p>
                                                    <p className="text-sm" style={{ color: "#6b6b6b" }}>
                                                        Visa, Mastercard, American Express
                                                    </p>
                                                </div>
                                            </label>
                                            <label className="flex cursor-pointer items-center gap-3 rounded-lg border-2 p-4 transition-colors hover:bg-gray-50">
                                                <input type="radio" name="payment" value="cod" className="h-5 w-5" />
                                                <div className="flex-1">
                                                    <p className="font-medium" style={{ color: "#2d2d2d" }}>
                                                        Наложен платеж
                                                    </p>
                                                    <p className="text-sm" style={{ color: "#6b6b6b" }}>
                                                        Плащане при доставка
                                                    </p>
                                                </div>
                                            </label>
                                        </div>
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
                                <div className="sticky top-24 rounded-lg p-6 shadow-md" style={{ backgroundColor: "#fff5fa" }}>
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

                {/* Footer */}
                <footer className="w-full px-4 py-8" style={{ backgroundColor: "#fff5fa" }}>
                    <div className="mx-auto max-w-7xl text-center">
                        <p className="text-sm font-light" style={{ color: "#6b6b6b" }}>
                            © 2025 Knigarela – Твоето приказно време започва тук.
                        </p>
                    </div>
                </footer>
            </main>
        </>
    )
}

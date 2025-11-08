"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import Image from "next/image";
import { getCart, addToCart, removeFromCart, clearCart } from "@/api/cart";

interface CartItem {
    boxId: string;
    title: string;
    unitPrice: number;
    quantity: number;
    imageUrl: string;
    purchaseType: string;
}

export default function CartPage() {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        getCart().then(setCartItems).finally(() => setLoading(false));
    }, []);

    const updateQuantity = async (boxId: string, newQuantity: number, purchaseType: string = "single") => {
        if (newQuantity < 1) {
            setCartItems(await removeFromCart(boxId, purchaseType));
            return;
        }
        await addToCart(boxId, newQuantity - (cartItems.find(i => i.boxId === boxId && i.purchaseType === purchaseType)?.quantity || 0), purchaseType);
        setCartItems(await getCart());
    };

    const removeItem = async (boxId: string, purchaseType: string = "single") => {
        setCartItems(await removeFromCart(boxId, purchaseType));
    };

    const subtotal = cartItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    const shipping = 5.99;
    const total = subtotal + shipping;

    if (loading) {
        return (
            <>
                <Navbar />
                <main className="flex h-[60vh] items-center justify-center text-gray-500">
                    Зареждане...
                </main>
            </>
        );
    }

    return (
        <>
            <Navbar />

            <main className="min-h-screen">
                {/* Header */}
                <header className="w-full px-4 py-12" style={{ backgroundColor: "#D176A3" }}>
                    <div className="mx-auto max-w-7xl">
                        <h1 className="text-center text-3xl font-semibold text-white md:text-4xl">
                            Моята количка
                        </h1>
                    </div>
                </header>

                {/* Cart Content */}
                <section className="w-full bg-white px-4 py-16">
                    <div className="mx-auto max-w-7xl">
                        {cartItems.length === 0 ? (
                            <div className="py-16 text-center">
                                <div className="mb-4 text-6xl">🛒</div>
                                <h2 className="mb-4 text-2xl font-semibold" style={{ color: "#2d2d2d" }}>
                                    Вашата количка е празна
                                </h2>
                                <p className="mb-8 text-gray-600">
                                    Добавете книги, за да започнете вашето приключение
                                </p>
                                <a
                                    href="/all-boxes"
                                    className="inline-block rounded-full px-8 py-3 font-medium text-white transition-all duration-300 hover:shadow-lg"
                                    style={{ backgroundColor: "#D176A3" }}
                                >
                                    Разгледайте кутиите
                                </a>
                            </div>
                        ) : (
                            <div className="grid gap-8 lg:grid-cols-3">
                                {/* Cart Items */}
                                <div className="space-y-4 lg:col-span-2">
                                    {cartItems.map((item) => (
                                        <div key={`${item.boxId}-${item.purchaseType}`} className="flex gap-4 bg-white p-4 shadow-md">
                                            <div className="relative h-32 w-32 flex-shrink-0 overflow-hidden">
                                                <Image
                                                    src={`${baseUrl}${item.imageUrl}` || "/placeholder.svg"}
                                                    alt={item.title}
                                                    fill
                                                    className="object-cover transition-transform duration-400 hover:scale-110"
                                                />
                                            </div>

                                            <div className="flex flex-1 flex-col justify-between">
                                                <div>
                                                    <h3 className="mb-1 text-lg font-semibold" style={{ color: "#2d2d2d" }}>
                                                        {item.title}
                                                    </h3>
                                                    <p className="text-xl font-semibold" style={{ color: "#D176A3" }}>
                                                        {item.unitPrice.toFixed(2)} лв
                                                    </p>
                                                </div>

                                                <div className="flex items-center gap-4">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => updateQuantity(item.boxId, item.quantity - 1, item.purchaseType)}
                                                            className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                                                            style={{ backgroundColor: "#D176A3" }}
                                                        >
                                                            -
                                                        </button>
                                                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                                                        <button
                                                            onClick={() => updateQuantity(item.boxId, item.quantity + 1, item.purchaseType)}
                                                            className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                                                            style={{ backgroundColor: "#D176A3" }}
                                                        >
                                                            +
                                                        </button>
                                                    </div>

                                                    <button
                                                        onClick={() => removeItem(item.boxId, item.purchaseType)}
                                                        className="ml-auto text-gray-500 hover:text-red-500 transition-colors duration-200"
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="h-5 w-5"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                            />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Summary */}
                                <div className="lg:col-span-1">
                                    <div className="sticky top-24 p-6 shadow-md" style={{ backgroundColor: "#fff5fa" }}>
                                        <h2 className="mb-6 text-2xl font-semibold" style={{ color: "#2d2d2d" }}>
                                            Обобщение
                                        </h2>
                                        <div className="mb-6 space-y-3">
                                            <div className="flex justify-between text-gray-700">
                                                <span>Междинна сума:</span>
                                                <span>{subtotal.toFixed(2)} лв</span>
                                            </div>
                                            <div className="flex justify-between text-gray-700">
                                                <span>Доставка:</span>
                                                <span>{shipping.toFixed(2)} лв</span>
                                            </div>
                                            <div className="flex justify-between border-t pt-3 text-xl font-semibold">
                                                <span>Общо:</span>
                                                <span style={{ color: "#D176A3" }}>{total.toFixed(2)} лв</span>
                                            </div>
                                        </div>

                                        <button
                                            className="w-full rounded-full py-3 font-medium text-white transition-all duration-300 hover:shadow-lg"
                                            style={{ backgroundColor: "#D176A3" }}
                                        >
                                            Към плащане
                                        </button>

                                        <a
                                            href="/"
                                            className="mt-4 block text-center text-gray-600 transition-colors duration-200 hover:text-[#D176A3]"
                                        >
                                            Продължи с пазаруването
                                        </a>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                <footer className="w-full px-4 py-8" style={{ backgroundColor: "#fff5fa" }}>
                    <div className="mx-auto max-w-7xl text-center">
                        <p className="text-sm font-light" style={{ color: "#6b6b6b" }}>
                            © 2025 Knigarela – Твоето приказно време започва тук.
                        </p>
                    </div>
                </footer>
            </main>
        </>
    );
}

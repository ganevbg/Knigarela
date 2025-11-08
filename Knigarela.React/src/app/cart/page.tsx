"use client";

import { Navbar } from "@/components/navbar";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
    const { items, add, remove, clear } = useCart();
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const subtotal = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
    const shipping = 5.99;
    const total = subtotal + shipping;

    return (
        <>
            <Navbar />
            <main className="min-h-screen">
                <header className="w-full px-4 py-12" style={{ backgroundColor: "#D176A3" }}>
                    <div className="mx-auto max-w-7xl">
                        <h1 className="text-center text-3xl font-semibold text-white md:text-4xl">
                            Моята количка
                        </h1>
                    </div>
                </header>

                <section className="w-full bg-white px-4 py-16">
                    <div className="mx-auto max-w-7xl">
                        {items.length === 0 ? (
                            <div className="py-16 text-center">
                                <div className="mb-4 text-6xl">🛒</div>
                                <h2 className="mb-4 text-2xl font-semibold text-[#2d2d2d]">
                                    Вашата количка е празна
                                </h2>
                                <p className="mb-8 text-gray-600">Добавете книги, за да започнете вашето приключение</p>
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
                                <div className="space-y-4 lg:col-span-2">
                                    {items.map((item) => (
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
                                                    <h3 className="mb-1 text-lg font-semibold text-[#2d2d2d]">{item.title}</h3>
                                                    <p className="text-xl font-semibold text-[#D176A3]">
                                                        {item.unitPrice.toFixed(2)} лв
                                                    </p>
                                                </div>

                                                <div className="flex items-center gap-4">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() =>
                                                                add(item.boxId, item.purchaseType, -1)
                                                            }
                                                            className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                                                            style={{ backgroundColor: "#D176A3" }}
                                                        >
                                                            -
                                                        </button>
                                                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                                                        <button
                                                            onClick={() =>
                                                                add(item.boxId, item.purchaseType, 1)
                                                            }
                                                            className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                                                            style={{ backgroundColor: "#D176A3" }}
                                                        >
                                                            +
                                                        </button>
                                                    </div>

                                                    <button
                                                        onClick={() => remove(item.boxId, item.purchaseType)}
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
                                        <h2 className="mb-6 text-2xl font-semibold text-[#2d2d2d]">
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

                                        <Button
                                            className="w-full rounded-full py-3 font-medium text-white transition-all duration-300 hover:shadow-lg"
                                            style={{ backgroundColor: "#D176A3" }}
                                        >
                                            Към плащане
                                        </Button>

                                        <button
                                            onClick={clear}
                                            className="mt-4 block w-full text-center text-gray-600 transition-colors duration-200 hover:text-[#D176A3]"
                                        >
                                            Изчисти количката
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </>
    );
}

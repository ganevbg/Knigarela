"use client";

import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { CartItemCard } from "@/components/cart/CartItemCard";
import { formatPrice } from "@/lib/utils"

export default function CartPage() {
    const { items, add, remove, clear } = useCart();
    const subtotal = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
    const shipping = 5.99;
    const total = subtotal + shipping;

    return (
        <>
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
                                    <CartItemCard
                                        key={`${item.boxId}-${item.purchaseType}`}
                                        boxId={item.boxId}
                                        title={item.title}
                                        unitPrice={item.unitPrice}
                                        quantity={item.quantity}
                                        imageUrl={item.imageUrl}
                                        purchaseType={item.purchaseType}
                                        onRemove={remove}
                                        onUpdateQuantity={add}
                                    />
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
                                                <span>{formatPrice(subtotal, true)}</span>
                                        </div>
                                        <div className="flex justify-between text-gray-700">
                                            <span>Доставка:</span>
                                                <span>{formatPrice(shipping, true)}</span>
                                        </div>
                                        <div className="flex justify-between border-t pt-3 text-xl font-semibold">
                                            <span>Общо:</span>
                                                <span style={{ color: "#D176A3" }}>{formatPrice(total, true)} </span>
                                        </div>
                                    </div>

                                    <a href="/checkout">
                                        <Button
                                            className="w-full rounded-full py-3 font-medium text-white transition-all duration-300 hover:shadow-lg"
                                            style={{ backgroundColor: "#D176A3" }}
                                        >
                                            Към плащане
                                        </Button>
                                    </a>

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
        </>
    );
}

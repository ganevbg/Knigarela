"use client";

import Image from "next/image";

interface CartItemCardProps {
    boxId: string;
    title: string;
    unitPrice: number;
    quantity: number;
    imageUrl: string;
    purchaseType: string;
    baseUrl?: string;
    onRemove: (boxId: string, purchaseType: string) => void;
    onUpdateQuantity: (boxId: string, purchaseType: string, quantity: number) => void;
}

export function CartItemCard({
    boxId,
    title,
    unitPrice,
    quantity,
    imageUrl,
    purchaseType,
    baseUrl = "",
    onRemove,
    onUpdateQuantity,
}: CartItemCardProps) {
    return (
        <div className="flex gap-4 rounded-lg bg-white p-4 shadow-md">
            {/* Image */}
            <div className="relative h-32 w-32 flex-shrink-0 overflow-hidden rounded-md">
                <Image
                    src={`${baseUrl}${imageUrl}` || "/placeholder.svg"}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-300 hover:scale-110"
                />
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col justify-between">
                <div>
                    <h3 className="mb-1 text-lg font-semibold text-[#2d2d2d]">{title}</h3>
                    <p className="text-sm text-gray-500">{purchaseType === "subscription" ? "Абонамент" : "Единична покупка"}</p>
                    <p className="text-xl font-semibold text-[#D176A3]">{unitPrice.toFixed(2)} лв</p>
                </div>

                <div className="flex items-center gap-4">
                    {/* Quantity controls */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => onUpdateQuantity(boxId, purchaseType, -1)}
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                            style={{ backgroundColor: "#D176A3" }}
                        >
                            -
                        </button>
                        <span className="w-8 text-center font-medium">{quantity}</span>
                        <button
                            onClick={() => onUpdateQuantity(boxId, purchaseType, 1)}
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                            style={{ backgroundColor: "#D176A3" }}
                        >
                            +
                        </button>
                    </div>

                    {/* Remove button */}
                    <button
                        onClick={() => onRemove(boxId, purchaseType)}
                        className="ml-auto text-gray-500 hover:text-red-500 transition-colors duration-200"
                        aria-label="Remove item">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}

"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import { getBoxBySlug } from "@/api/boxes";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { addToCart } from "@/api/cart";
import { useCart } from "@/context/CartContext";
import { toast } from "react-toastify";
import { resolveImageUrl } from "../../../lib/utils";

type Box = {
    id: string;
    title: string;
    slug: string;
    description: string;
    singlePrice: number;
    subscriptionPrice: number;
    mainImageUrl?: string;
    imageUrls?: string[];
    available: boolean;
};

export default function BoxDetailPage() {
    const { slug } = useParams<{ slug: string }>();
    const [box, setBox] = useState<Box | null>(null);
    const [loading, setLoading] = useState(true);
    const [purchaseType, setPurchaseType] = useState<"single" | "subscription">("single")
    const { refresh } = useCart();

    const handleAddToCart = async (
        boxId: string,
        purchaseType: string = "single"
    ) => {
        await addToCart(boxId, 1, purchaseType);
        await refresh();
        toast.success("Добавено в количката! 🛒");
    };

    useEffect(() => {
        async function loadBox() {
            try {
                const data = await getBoxBySlug(slug);
                if (!data) notFound();
                setBox(data);
            } catch (err) {
                console.error("Failed to load box:", err);
            } finally {
                setLoading(false);
            }
        }
        loadBox();
    }, [slug]);

    if (loading)
        return (
            <>
                Зареждане...
            </>
        );

    if (!box) {
        notFound();
    }

    const imageUrl = resolveImageUrl(box.mainImageUrl ?? "");

    return (
        <>
            {/* Hero Section */}
            <section className="w-full px-4 py-8" style={{ backgroundColor: "#fff5fa" }}>
                <div className="mx-auto max-w-7xl">
                    <Link
                        href="/all-boxes"
                        className="mb-6 inline-flex items-center gap-2 text-gray-600 transition-colors hover:text-[#D176A3]"
                    >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Обратно към всички кутии
                    </Link>
                </div>
            </section>

            {/* Box Detail Section */}
            <section className="w-full px-4 py-12">
                <div className="mx-auto max-w-7xl">
                    <div className="grid gap-12 md:grid-cols-2">
                        <div className="space-y-4">
                            {/* Main Image */}
                            <div className="relative aspect-square overflow-hidden rounded-lg shadow-xl">
                                <img
                                    src={imageUrl || "/placeholder.svg"}
                                    alt={box.title}
                                    className="h-full w-full object-cover"
                                />
                                <div
                                    className="absolute top-4 right-4 rounded-full px-4 py-2 text-sm font-medium text-white shadow-md"
                                    style={{ backgroundColor: "#D176A3" }}
                                >
                                </div>
                            </div>

                            {/* Additional Images */}
                            {box.imageUrls && box.imageUrls.length > 1 && (
                                <div className="grid grid-cols-3 gap-4">
                                    {box.imageUrls.slice(1).map((img, index) => (
                                        <div key={index} className="relative aspect-square overflow-hidden rounded-lg shadow-md">
                                            <img
                                                src={resolveImageUrl(img) || "/placeholder.svg"}
                                                alt={`${box.title} ${index + 2}`}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Details */}
                        <div className="flex flex-col justify-center">
                            <h1 className="mb-4 text-4xl font-semibold md:text-5xl" style={{ color: "#2d2d2d" }}>
                                {box.title}
                            </h1>

                            {box.available ? (
                                <>
                                    <div className="mb-6">
                                        <Label className="mb-3 block text-base font-medium" style={{ color: "#2d2d2d" }}>
                                            Избери тип покупка
                                        </Label>
                                        <RadioGroup
                                            value={purchaseType}
                                            onValueChange={(value) => setPurchaseType(value as "single" | "subscription")}
                                        >
                                            <div
                                                className="mb-3 flex cursor-pointer items-center space-x-3 rounded-lg border-2 p-4 transition-all"
                                                style={{
                                                    borderColor: purchaseType === "single" ? "#D176A3" : "#e5e5e5",
                                                    backgroundColor: purchaseType === "single" ? "#fff5fa" : "white",
                                                }}
                                                onClick={() => setPurchaseType("single")}
                                            >
                                                <RadioGroupItem value="single" id="single" style={{ borderColor: "#D176A3" }} />
                                                <Label htmlFor="single" className="flex-1 cursor-pointer">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <p className="font-medium" style={{ color: "#2d2d2d" }}>
                                                                Еднократна покупка
                                                            </p>
                                                            <p className="text-sm" style={{ color: "#6b6b6b" }}>
                                                                Поръчай само тази кутия
                                                            </p>
                                                        </div>
                                                        <p className="pl-2 text-xl font-bold" style={{ color: "#D176A3" }}>
                                                            {box.singlePrice} лв.
                                                        </p>
                                                    </div>
                                                </Label>
                                            </div>
                                            <div
                                                className="flex cursor-pointer items-center space-x-3 rounded-lg border-2 p-4 transition-all"
                                                style={{
                                                    borderColor: purchaseType === "subscription" ? "#D176A3" : "#e5e5e5",
                                                    backgroundColor: purchaseType === "subscription" ? "#fff5fa" : "white",
                                                }}
                                                onClick={() => setPurchaseType("subscription")}
                                            >
                                                <RadioGroupItem value="subscription" id="subscription" style={{ borderColor: "#D176A3" }} />
                                                <Label htmlFor="subscription" className="flex-1 cursor-pointer">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <p className="font-medium" style={{ color: "#2d2d2d" }}>
                                                                Месечен абонамент
                                                            </p>
                                                            <p className="text-sm" style={{ color: "#6b6b6b" }}>
                                                                Спести {box.singlePrice - box.subscriptionPrice} лв. на месец
                                                            </p>
                                                        </div>
                                                        <p className="pl-2 text-xl font-bold" style={{ color: "#D176A3" }}>
                                                            {box.subscriptionPrice} лв./месец
                                                        </p>
                                                    </div>
                                                </Label>
                                            </div>
                                        </RadioGroup>
                                    </div>
                                    <div className="flex flex-col gap-4 sm:flex-row">
                                        <Button
                                            size="lg"
                                            onClick={() => handleAddToCart(box.id, purchaseType)}
                                            className="rounded-full px-8 py-6 text-base font-medium text-white shadow-md transition-all duration-300 hover:shadow-lg"
                                            style={{ backgroundColor: "#D176A3" }}
                                        >
                                            Добави в количката
                                        </Button>
                                        <Link href="/all-boxes">
                                            <Button
                                                size="lg"
                                                variant="outline"
                                                className="w-full rounded-full border-2 bg-transparent px-8 py-6 text-base font-medium transition-all duration-300"
                                                style={{
                                                    borderColor: "#D176A3",
                                                    color: "#D176A3",
                                                }}
                                            >
                                                Виж всички кутии
                                            </Button>
                                        </Link>
                                    </div>
                                </>
                            ) : (
                                <span className="text-sm font-medium text-gray-400">Няма наличност</span>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <section className="w-full px-4 py-16" style={{ backgroundColor: "#fff5fa" }}>
                <div className="mx-auto max-w-7xl">
                    <h2 className="mb-8 text-3xl font-semibold md:text-4xl" style={{ color: "#2d2d2d" }}>
                        За тази кутия
                    </h2>
                    <div className="rounded-lg bg-white p-8 shadow-md">
                        <div className="prose prose-lg max-w-none" style={{ color: "#6b6b6b" }}>
                            {box.description?.split("\n").map((paragraph, index) => (
                                <p key={index} className="mb-4 text-base leading-relaxed">
                                    {paragraph}
                                </p>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

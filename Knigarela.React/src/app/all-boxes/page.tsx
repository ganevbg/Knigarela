"use client";

import Link from "next/link"
import { useEffect, useState } from "react";
import { getAllBoxes } from "@/api/boxes";

type Box = {
    title: string;
    slug: string;
    mainImageUrl: string;
    available: boolean;
};

export default function AllBoxesPage() {

    const [boxes, setBox] = useState<Box[] | null>(null);
    const [loading, setLoading] = useState(true);
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        async function fetchBoxes() {
            try {
                const data = await getAllBoxes();
                setBox(data);
            } catch (error) {
                console.error("Failed to load active box:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchBoxes();
    }, []);

    if (loading) {
        return (
            <div className="flex min-h-[300px] items-center justify-center text-gray-500">
                Зареждане...
            </div>
        );
    }

    if (!boxes || boxes.length === 0) {
        return (
            <div className="flex min-h-[300px] items-center justify-center text-gray-500">
                Няма налични кутии.
            </div>
        );
    }

    return (
        <>
            {/* Boxes Grid */}
            <section className="w-full px-4 py-16">
                <div className="mx-auto max-w-7xl">
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {boxes.map((box) => (
                            <Link key={box.slug} href={`/box/${box.slug}`} className="group">
                                <div className="overflow-hidden rounded-lg bg-white shadow-md transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl">
                                    <div className="relative aspect-[3/4] overflow-hidden">
                                        <img
                                            src={`${baseUrl}${box.mainImageUrl}` || "/placeholder.svg"}
                                            alt={box.title}
                                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                                        />
                                    </div>
                                    <div className="p-6">
                                        <h3 className="mb-2 text-xl font-semibold" style={{ color: "#2d2d2d" }}>
                                            {box.title}
                                        </h3>
                                        <div className="flex items-center justify-between">
                                            {box.available ? (
                                                <span className="text-sm font-medium" style={{ color: "#6b6b6b" }}>
                                                    В наличност
                                                </span>
                                            ) : (
                                                <span className="text-sm font-medium text-gray-400">Няма наличност</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="w-full px-4 py-16" style={{ backgroundColor: "#fff5fa" }}>
                <div className="mx-auto max-w-4xl text-center">
                    <h2 className="mb-6 text-3xl font-semibold md:text-4xl" style={{ color: "#2d2d2d" }}>
                        Не пропускайте следващата кутия!
                    </h2>
                    <p className="mb-8 text-lg leading-relaxed" style={{ color: "#6b6b6b" }}>
                        Абонирайте се сега и получавайте ексклузивни книжни колекции всеки месец на вашата врата.
                    </p>
                    <Link
                        href="/subscribe"
                        className="inline-block rounded-full px-8 py-4 text-base font-medium text-white shadow-md transition-all duration-300 hover:shadow-lg"
                        style={{ backgroundColor: "#D176A3" }}
                    >
                        Абонирай се сега
                    </Link>
                </div>
            </section>
        </>
    )
}

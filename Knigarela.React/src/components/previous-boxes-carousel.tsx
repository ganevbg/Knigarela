"use client"

import { useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getNotActiveBoxes } from "@/api/boxes";
import { useEffect, useState } from "react";
import Link from "next/link"

type Box = {
    title: string;
    slug: string;
    mainImageUrl: string;
};

export function PreviousBoxesCarousel() {
    const carouselRef = useRef<HTMLDivElement>(null)
    const [boxes, setBox] = useState<Box[] | null>(null);
    const [loading, setLoading] = useState(true);
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        async function fetchBoxes() {
            try {
                const data = await getNotActiveBoxes();
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
                Няма предишни кутии.
            </div>
        );
    }


    const scroll = (direction: "left" | "right") => {
        if (carouselRef.current) {
            const scrollAmount = 320
            const newScrollPosition = carouselRef.current.scrollLeft + (direction === "left" ? -scrollAmount : scrollAmount)
            carouselRef.current.scrollTo({
                left: newScrollPosition,
                behavior: "smooth",
            })
        }
    }

    return (
        <div className="relative">
            {/* Navigation Buttons */}
            <Button
                variant="outline"
                size="icon"
                className="absolute top-1/2 left-0 z-10 hidden h-12 w-12 -translate-y-1/2 rounded-full border border-[#D176A3] bg-white shadow-lg md:flex"
                onClick={() => scroll("left")}
                style={{ color: "#D176A3" }}
            >
                <ChevronLeft className="h-6 w-6" />
            </Button>

            <Button
                variant="outline"
                size="icon"
                className="absolute top-1/2 right-0 z-10 hidden h-12 w-12 -translate-y-1/2 rounded-full border border-[#D176A3] bg-white shadow-lg md:flex"
                onClick={() => scroll("right")}
                style={{ color: "#D176A3" }}
            >
                <ChevronRight className="h-6 w-6" />
            </Button>

            {/* Carousel */}
            <div ref={carouselRef} className="carousel-container flex gap-6 overflow-x-auto px-4 py-4 md:px-12">
                {boxes.map((box, index) => (
                    <div
                        key={`${box.slug}-${index}`}
                        className="group w-64 flex-shrink-0 cursor-pointer"
                        style={{
                            animation: `fadeIn 0.8s ease-out ${0.6 + index * 0.1}s forwards`,
                            opacity: 0,
                        }}
                    >
                        <Link
                            href={`/box/${box.slug}`}
                            key={box.slug}
                            className="group w-64 flex-shrink-0 cursor-pointer"
                            style={{
                                animation: `fadeIn 0.8s ease-out ${0.6 + index * 0.1}s forwards`,
                                opacity: 0,
                            }}
                        >
                            <div className="overflow-hidden bg-white shadow-md transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl">
                                <div className="relative aspect-[3/4] overflow-hidden">
                                    <img
                                        src={`${baseUrl}${box.mainImageUrl}` || "/placeholder.svg"}
                                        alt={box.title}
                                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                                    />
                                </div>
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold" style={{ color: "#2d2d2d" }}>
                                        {box.title}
                                    </h3>
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    )
}

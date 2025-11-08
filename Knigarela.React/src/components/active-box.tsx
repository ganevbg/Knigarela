"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getActiveBox } from "@/api/boxes";

type Box = {
  id: string;
  title: string;
  slug: string;
  description: string;
  mainImageUrl: string;
};

export function ActiveBox() {
  const [box, setBox] = useState<Box | null>(null);
  const [loading, setLoading] = useState(true);
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    async function fetchBox() {
      try {
        const data = await getActiveBox();
        setBox(data);
      } catch (error) {
        console.error("Failed to load active box:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchBox();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center text-gray-500">
        Зареждане...
      </div>
    );
  }

  if (!box) {
    return (
      <div className="flex min-h-[300px] items-center justify-center text-gray-500">
        Няма активна кутия в момента.
      </div>
    );
  }

  // pick main or first image
  // optional: extract month/year if you store CreatedAt
  const label ="Текуща кутия";
    const imgUrl = `${baseUrl}${box.mainImageUrl}`;
  return (
    <div
      className="animate-fade-in overflow-hidden bg-white shadow-lg"
      style={{
        animationDelay: "0.4s",
        opacity: 0,
        animation: "fadeIn 0.8s ease-out 0.4s forwards",
      }}
    >
      <div className="flex flex-col md:flex-row">
        {/* Image Section */}
        <div className="relative md:w-1/2">
          <div className="relative aspect-square md:aspect-auto md:h-full">
                      <img src={imgUrl} alt={box.title} className="h-full w-full object-cover" />
            <div
              className="absolute top-4 right-4 rounded-full px-4 py-2 text-sm font-medium text-white shadow-md"
              style={{ backgroundColor: "#D176A3" }}
            >
              {label}
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex flex-col justify-center p-8 md:w-1/2 md:p-12">
          <h2 className="mb-4 text-3xl font-semibold md:text-4xl" style={{ color: "#2d2d2d" }}>
            {box.title}
          </h2>
          <p className="mb-6 text-base leading-relaxed md:text-lg" style={{ color: "#6b6b6b" }}>
            {box.description}
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link href={`/box/${box.slug ?? box.id}`}>
              <Button
                size="lg"
                className="w-full rounded-full px-8 py-6 text-base font-medium text-white shadow-md transition-all duration-300 hover:shadow-lg sm:w-auto"
                style={{ backgroundColor: "#D176A3" }}
              >
                Виж повече
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

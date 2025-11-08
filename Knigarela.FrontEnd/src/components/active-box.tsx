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
  MainImageUrl: string;
};

export function ActiveBox() {
  const [box, setBox] = useState<Box | null>(null);
  const [loading, setLoading] = useState(true);

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
      <div className="flex justify-center items-center min-h-[300px] text-gray-500">
        Зареждане...
      </div>
    );
  }

  if (!box) {
    return (
      <div className="flex justify-center items-center min-h-[300px] text-gray-500">
        Няма активна кутия в момента.
      </div>
    );
  }

  // pick main or first image
  // optional: extract month/year if you store CreatedAt
  const label ="Текуща кутия";

  return (
    <div
      className="bg-white shadow-lg overflow-hidden animate-fade-in"
      style={{
        animationDelay: "0.4s",
        opacity: 0,
        animation: "fadeIn 0.8s ease-out 0.4s forwards",
      }}
    >
      <div className="flex flex-col md:flex-row">
        {/* Image Section */}
        <div className="md:w-1/2 relative">
          <div className="aspect-square md:aspect-auto md:h-full relative">
            <img src={box.MainImageUrl} alt={box.title} className="w-full h-full object-cover" />
            <div
              className="absolute top-4 right-4 px-4 py-2 rounded-full text-white text-sm font-medium shadow-md"
              style={{ backgroundColor: "#ffcfe7" }}
            >
              {label}
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4" style={{ color: "#2d2d2d" }}>
            {box.title}
          </h2>
          <p className="text-base md:text-lg leading-relaxed mb-6" style={{ color: "#6b6b6b" }}>
            {box.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href={`/box/${box.slug ?? box.id}`}>
              <Button
                size="lg"
                className="w-full sm:w-auto text-white font-medium rounded-full px-8 py-6 text-base shadow-md hover:shadow-lg transition-all duration-300"
                style={{ backgroundColor: "#ffcfe7" }}
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

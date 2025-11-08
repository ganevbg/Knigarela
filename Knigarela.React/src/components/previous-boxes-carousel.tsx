"use client"

import { useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const previousBoxes = [
  {
    id: 1,
    month: "Декември 2024",
    title: "Коледна магия",
    image: "/festive-holiday-book-collection-with-red-and-gold-.jpg",
  },
  {
    id: 2,
    month: "Ноември 2024",
    title: "Есенно четиво",
    image: "/autumn-themed-books-with-warm-orange-and-brown-ton.jpg",
  },
  {
    id: 3,
    month: "Октомври 2024",
    title: "Мистерия и трилър",
    image: "/mystery-thriller-books-with-dark-atmospheric-cover.jpg",
  },
  {
    id: 4,
    month: "Септември 2024",
    title: "Обратно към книгите",
    image: "/contemporary-fiction-books-with-modern-minimalist-.jpg",
  },
  {
    id: 5,
    month: "Август 2024",
    title: "Лятна романтика",
    image: "/romantic-summer-beach-reads-with-pastel-covers.jpg",
  },
  {
    id: 6,
    month: "Юли 2024",
    title: "Приключения те очакват",
    image: "/adventure-fantasy-books-with-vibrant-colorful-cove.jpg",
  },
]

export function PreviousBoxesCarousel() {
  const carouselRef = useRef<HTMLDivElement>(null)

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
        className="absolute top-1/2 left-0 z-10 hidden h-12 w-12 -translate-y-1/2 rounded-full border-0 bg-white shadow-lg md:flex"
        onClick={() => scroll("left")}
        style={{ color: "#D176A3" }}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="absolute top-1/2 right-0 z-10 hidden h-12 w-12 -translate-y-1/2 rounded-full border-0 bg-white shadow-lg md:flex"
        onClick={() => scroll("right")}
        style={{ color: "#D176A3" }}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Carousel */}
      <div ref={carouselRef} className="carousel-container flex gap-6 overflow-x-auto px-4 py-4 md:px-12">
        {previousBoxes.map((box, index) => (
          <div
            key={box.id}
            className="group w-64 flex-shrink-0 cursor-pointer"
            style={{
              animation: `fadeIn 0.8s ease-out ${0.6 + index * 0.1}s forwards`,
              opacity: 0,
            }}
          >
            <div className="overflow-hidden bg-white shadow-md transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl">
              <div className="relative aspect-[3/4] overflow-hidden">
                <img
                  src={box.image || "/placeholder.svg"}
                  alt={box.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <div className="p-4">
                <p className="mb-1 text-sm font-medium" style={{ color: "#D176A3" }}>
                  {box.month}
                </p>
                <h3 className="text-lg font-semibold" style={{ color: "#2d2d2d" }}>
                  {box.title}
                </h3>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

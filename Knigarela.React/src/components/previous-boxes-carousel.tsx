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
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white shadow-lg border-0 w-12 h-12 hidden md:flex"
        onClick={() => scroll("left")}
        style={{ color: "#ffcfe7" }}
      >
        <ChevronLeft className="w-6 h-6" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white shadow-lg border-0 w-12 h-12 hidden md:flex"
        onClick={() => scroll("right")}
        style={{ color: "#ffcfe7" }}
      >
        <ChevronRight className="w-6 h-6" />
      </Button>

      {/* Carousel */}
      <div ref={carouselRef} className="carousel-container flex gap-6 overflow-x-auto px-4 md:px-12 py-4">
        {previousBoxes.map((box, index) => (
          <div
            key={box.id}
            className="flex-shrink-0 w-64 group cursor-pointer"
            style={{
              animation: `fadeIn 0.8s ease-out ${0.6 + index * 0.1}s forwards`,
              opacity: 0,
            }}
          >
            <div className="bg-white shadow-md overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:scale-105">
              <div className="aspect-[3/4] relative overflow-hidden">
                <img
                  src={box.image || "/placeholder.svg"}
                  alt={box.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <div className="p-4">
                <p className="text-sm font-medium mb-1" style={{ color: "#ffcfe7" }}>
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

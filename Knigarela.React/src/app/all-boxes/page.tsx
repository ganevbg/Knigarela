import { Navbar } from "@/components/navbar"
import Link from "next/link"
import { Header } from "@/components/header"

const allBoxes = [
    {
        id: "january-2025",
        month: "Януари 2025",
        title: "Зимни приказки",
        image: "/elegant-book-subscription-box-with-beautiful-hardc.jpg",
        price: 49.99,
        available: true,
    },
    {
        id: "december-2024",
        month: "Декември 2024",
        title: "Коледна магия",
        image: "/festive-holiday-book-collection-with-red-and-gold-.jpg",
        price: 49.99,
        available: true,
    },
    {
        id: "november-2024",
        month: "Ноември 2024",
        title: "Есенно четиво",
        image: "/autumn-themed-books-with-warm-orange-and-brown-ton.jpg",
        price: 49.99,
        available: false,
    },
    {
        id: "october-2024",
        month: "Октомври 2024",
        title: "Мистерия и трилър",
        image: "/mystery-thriller-books-with-dark-atmospheric-cover.jpg",
        price: 49.99,
        available: false,
    },
    {
        id: "september-2024",
        month: "Септември 2024",
        title: "Обратно към книгите",
        image: "/contemporary-fiction-books-with-modern-minimalist-.jpg",
        price: 49.99,
        available: false,
    },
    {
        id: "august-2024",
        month: "Август 2024",
        title: "Лятна романтика",
        image: "/romantic-summer-beach-reads-with-pastel-covers.jpg",
        price: 49.99,
        available: false,
    },
]

export default function AllBoxesPage() {
    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-white">
                {/* Header */}
                <Header />

                {/* Boxes Grid */}
                <section className="w-full px-4 py-16">
                    <div className="mx-auto max-w-7xl">
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {allBoxes.map((box) => (
                                <Link key={box.id} href={`/box/${box.id}`} className="group">
                                    <div className="overflow-hidden rounded-lg bg-white shadow-md transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl">
                                        <div className="relative aspect-[3/4] overflow-hidden">
                                            <img
                                                src={box.image || "/placeholder.svg"}
                                                alt={box.title}
                                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                                            />
                                            {!box.available && (
                                                <div className="bg-opacity-50 absolute inset-0 flex items-center justify-center bg-black">
                                                    <span className="text-lg font-semibold text-white">Изчерпана</span>
                                                </div>
                                            )}
                                            <div
                                                className="absolute top-4 right-4 rounded-full px-3 py-1 text-sm font-medium text-white shadow-md"
                                                style={{ backgroundColor: "#D176A3" }}
                                            >
                                                {box.month}
                                            </div>
                                        </div>
                                        <div className="p-6">
                                            <h3 className="mb-2 text-xl font-semibold" style={{ color: "#2d2d2d" }}>
                                                {box.title}
                                            </h3>
                                            <div className="flex items-center justify-between">
                                                <p className="text-2xl font-bold" style={{ color: "#D176A3" }}>
                                                    {box.price} лв.
                                                </p>
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

                {/* Footer */}
                <footer className="w-full bg-white px-4 py-8">
                    <div className="mx-auto max-w-7xl text-center">
                        <p className="text-sm font-light" style={{ color: "#6b6b6b" }}>
                            © 2025 Knigarela – Твоето приказно време започва тук.
                        </p>
                    </div>
                </footer>
            </main>
        </>
    )
}

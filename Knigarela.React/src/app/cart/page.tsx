"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import Image from "next/image"

interface CartItem {
  id: number
  title: string
  price: number
  quantity: number
  image: string
  month: string
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 1,
      title: "Зимна колекция 2025",
      price: 45.99,
      quantity: 1,
      image: "/festive-holiday-book-collection-with-red-and-gold-.jpg",
      month: "Януари 2025",
    },
    {
      id: 2,
      title: "Есенна колекция 2024",
      price: 42.99,
      quantity: 1,
      image: "/autumn-themed-books-with-warm-orange-and-brown-ton.jpg",
      month: "Октомври 2024",
    },
  ])

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return
    setCartItems(cartItems.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)))
  }

  const removeItem = (id: number) => {
    setCartItems(cartItems.filter((item) => item.id !== id))
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = 5.99
  const total = subtotal + shipping

  return (
    <>
      <Navbar />

      <main className="min-h-screen">
        {/* Header */}
        <header className="w-full py-12 px-4" style={{ backgroundColor: "#ffcfe7" }}>
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-semibold text-white text-center">Моята количка</h1>
          </div>
        </header>

        {/* Cart Content */}
        <section className="w-full px-4 py-16 bg-white">
          <div className="max-w-7xl mx-auto">
            {cartItems.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🛒</div>
                <h2 className="text-2xl font-semibold mb-4" style={{ color: "#2d2d2d" }}>
                  Вашата количка е празна
                </h2>
                <p className="text-gray-600 mb-8">Добавете книги, за да започнете вашето приключение</p>
                <a
                  href="/"
                  className="inline-block px-8 py-3 rounded-full text-white font-medium transition-all duration-300 hover:shadow-lg"
                  style={{ backgroundColor: "#ffcfe7" }}
                >
                  Разгледайте кутиите
                </a>
              </div>
            ) : (
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-4 p-4 bg-white shadow-md">
                      <div className="relative w-32 h-32 flex-shrink-0 overflow-hidden">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.title}
                          fill
                          className="object-cover transition-transform duration-400 hover:scale-110"
                        />
                      </div>

                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="text-lg font-semibold mb-1" style={{ color: "#2d2d2d" }}>
                            {item.title}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">{item.month}</p>
                          <p className="text-xl font-semibold" style={{ color: "#ffcfe7" }}>
                            {item.price.toFixed(2)} лв
                          </p>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 rounded-full flex items-center justify-center text-white transition-colors duration-200"
                              style={{ backgroundColor: "#ffcfe7" }}
                            >
                              -
                            </button>
                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 rounded-full flex items-center justify-center text-white transition-colors duration-200"
                              style={{ backgroundColor: "#ffcfe7" }}
                            >
                              +
                            </button>
                          </div>

                          <button
                            onClick={() => removeItem(item.id)}
                            className="ml-auto text-gray-500 hover:text-red-500 transition-colors duration-200"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                  <div className="p-6 shadow-md sticky top-24" style={{ backgroundColor: "#fff5fa" }}>
                    <h2 className="text-2xl font-semibold mb-6" style={{ color: "#2d2d2d" }}>
                      Обобщение
                    </h2>

                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between text-gray-700">
                        <span>Междинна сума:</span>
                        <span>{subtotal.toFixed(2)} лв</span>
                      </div>
                      <div className="flex justify-between text-gray-700">
                        <span>Доставка:</span>
                        <span>{shipping.toFixed(2)} лв</span>
                      </div>
                      <div
                        className="border-t pt-3 flex justify-between text-xl font-semibold"
                        style={{ color: "#2d2d2d" }}
                      >
                        <span>Общо:</span>
                        <span style={{ color: "#ffcfe7" }}>{total.toFixed(2)} лв</span>
                      </div>
                    </div>

                    <button
                      className="w-full py-3 rounded-full text-white font-medium transition-all duration-300 hover:shadow-lg"
                      style={{ backgroundColor: "#ffcfe7" }}
                    >
                      Към плащане
                    </button>

                    <a
                      href="/"
                      className="block text-center mt-4 text-gray-600 hover:text-[#ffcfe7] transition-colors duration-200"
                    >
                      Продължи с пазаруването
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Footer */}
        <footer className="w-full py-8 px-4" style={{ backgroundColor: "#fff5fa" }}>
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-sm font-light" style={{ color: "#6b6b6b" }}>
              © 2025 Knigarela – Твоето приказно време започва тук.
            </p>
          </div>
        </footer>
      </main>
    </>
  )
}

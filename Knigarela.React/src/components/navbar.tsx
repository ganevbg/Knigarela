"use client"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

export function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const { user, isAuthed, logout } = useAuth();

    const { totalCount } = useCart();

    return (
        <nav className="sticky top-0 z-50 w-full bg-white shadow-sm">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex-shrink-0">
                        <img src="/carriage.svg" alt="Книгарела" className="h-10 w-auto" loading="eager" />
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden items-center space-x-8 md:flex">
                        <Link href="/" className="font-medium text-gray-700 transition-colors duration-200 hover:text-[#D176A3]">
                            Начало
                        </Link>
                        <Link href="/all-boxes" className="font-medium text-gray-700 transition-colors duration-200 hover:text-[#D176A3]">
                            Всички кутии
                        </Link>
                        <Link href="/about" className="font-medium text-gray-700 transition-colors duration-200 hover:text-[#D176A3]">
                            За нас
                        </Link>

                        {user?.role === "Admin" && (
                            <>
                                <Link href="/admin/boxes" className="font-medium text-gray-700 transition-colors duration-200 hover:text-[#D176A3]">Кутии</Link>
                                <Link href="/admin/orders" className="font-medium text-gray-700 transition-colors duration-200 hover:text-[#D176A3]">Поръчки</Link>
                                <Link href="/admin/clients" className="font-medium text-gray-700 transition-colors duration-200 hover:text-[#D176A3]">Клиенти</Link>
                            </>
                        )}

                        {!isAuthed ? (
                            <Link href="/login" className="font-medium text-gray-700 hover:text-[#D176A3]" >
                                Вход
                            </Link>
                        ) : (
                            <button
                                onClick={logout}
                                className="font-medium text-gray-700 hover:text-[#D176A3]"
                            >
                                Изход
                            </button>
                        )}
                        <Link
                            href="/cart"
                            className="relative p-2 text-gray-700 transition-colors duration-200 hover:text-[#D176A3]"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                />
                            </svg>
                            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#D176A3] text-xs text-white">
                                {totalCount}
                            </span>
                        </Link>
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex items-center space-x-4 md:hidden">
                        <Link href="/cart" className="relative p-2 text-gray-700">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                />
                            </svg>
                            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#D176A3] text-xs text-white">
                                {totalCount}
                            </span>
                        </Link>
                        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gray-700 hover:text-[#D176A3]">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {mobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {mobileMenuOpen && (
                <div className="border-t border-gray-200 bg-white md:hidden">
                    <div className="space-y-1 px-2 pt-2 pb-3">
                        <Link
                            href="/"
                            className="block px-3 py-2 text-gray-700 transition-colors duration-200 hover:bg-gray-50 hover:text-[#D176A3]"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Начало
                        </Link>
                        <Link
                            href="/all-boxes"
                            className="block px-3 py-2 text-gray-700 transition-colors duration-200 hover:bg-gray-50 hover:text-[#D176A3]"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Всички кутии
                        </Link>
                        <Link
                            href="/about"
                            className="block px-3 py-2 text-gray-700 transition-colors duration-200 hover:bg-gray-50 hover:text-[#D176A3]"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            За нас
                        </Link>

                        {user?.role === "Admin" && (
                            <>
                                <Link
                                    href="/admin/boxes"
                                    className="block px-3 py-2 text-gray-700 transition-colors duration-200 hover:bg-gray-50 hover:text-[#D176A3]"
                                    onClick={() => setMobileMenuOpen(false)}>
                                    Кутии
                                </Link>
                                <Link
                                    href="/admin/orders"
                                    className="block px-3 py-2 text-gray-700 transition-colors duration-200 hover:bg-gray-50 hover:text-[#D176A3]"
                                    onClick={() => setMobileMenuOpen(false)}>
                                    Поръчки
                                </Link>
                                <Link
                                    href="/admin/clients"
                                    className="block px-3 py-2 text-gray-700 transition-colors duration-200 hover:bg-gray-50 hover:text-[#D176A3]"
                                    onClick={() => setMobileMenuOpen(false)}>
                                    Клиенти
                                </Link>
                            </>
                        )}

                        {/* ✅ Add auth links */}
                        {!isAuthed ? (
                            <Link
                                href="/login"
                                onClick={() => setMobileMenuOpen(false)}
                                className="block px-3 py-2 text-gray-700 hover:text-[#D176A3] hover:bg-gray-50 transition-colors duration-200"
                            >
                                Вход
                            </Link>
                        ) : (
                            <button
                                onClick={() => {
                                    logout();
                                    setMobileMenuOpen(false);
                                }}
                                className="block w-full text-left px-3 py-2 text-gray-700 hover:text-[#D176A3] hover:bg-gray-50 transition-colors duration-200"
                            >
                                Изход
                            </button>
                        )}
                    </div>
                </div>
            )}
        </nav>
    )
}

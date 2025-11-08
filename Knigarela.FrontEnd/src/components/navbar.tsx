"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useAuth } from "@/context/AuthContext";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { isAuthed, logout } = useAuth();

  return (
    <nav className="w-full bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <img src="/carriage.svg" alt="Книгарела" className="h-10 w-auto" loading="eager" />

          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-[#ffcfe7] transition-colors duration-200 font-medium">
              Начало
            </Link>
            <a href="#boxes" className="text-gray-700 hover:text-[#ffcfe7] transition-colors duration-200 font-medium">
              Всички кутии
            </a>
            <a href="#about" className="text-gray-700 hover:text-[#ffcfe7] transition-colors duration-200 font-medium">
              За нас
            </a>
             {!isAuthed ? (
        <Link
          href="/login"
          className="text-gray-700 hover:text-[#ffcfe7] font-medium"
        >
          Вход
        </Link>
      ) : (
        <button
          onClick={logout}
          className="text-gray-700 hover:text-[#ffcfe7] font-medium"
        >
          Изход
        </button>
      )}
            <Link
              href="/cart"
              className="relative p-2 text-gray-700 hover:text-[#ffcfe7] transition-colors duration-200"
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
              <span className="absolute -top-1 -right-1 bg-[#ffcfe7] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                2
              </span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
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
              <span className="absolute -top-1 -right-1 bg-[#ffcfe7] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                2
              </span>
            </Link>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gray-700 hover:text-[#ffcfe7]">
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
  <div className="md:hidden bg-white border-t border-gray-200">
    <div className="px-2 pt-2 pb-3 space-y-1">
      <Link
        href="/"
        className="block px-3 py-2 text-gray-700 hover:text-[#ffcfe7] hover:bg-gray-50 transition-colors duration-200"
        onClick={() => setMobileMenuOpen(false)}
      >
        Начало
      </Link>

      <a
        href="#boxes"
        className="block px-3 py-2 text-gray-700 hover:text-[#ffcfe7] hover:bg-gray-50 transition-colors duration-200"
        onClick={() => setMobileMenuOpen(false)}
      >
        Всички кутии
      </a>

      <a
        href="#about"
        className="block px-3 py-2 text-gray-700 hover:text-[#ffcfe7] hover:bg-gray-50 transition-colors duration-200"
        onClick={() => setMobileMenuOpen(false)}
      >
        За нас
      </a>

      {/* ✅ Add auth links */}
      {!isAuthed ? (
        <Link
          href="/login"
          onClick={() => setMobileMenuOpen(false)}
          className="block px-3 py-2 text-gray-700 hover:text-[#ffcfe7] hover:bg-gray-50 transition-colors duration-200"
        >
          Вход
        </Link>
      ) : (
        <button
          onClick={() => {
            logout();
            setMobileMenuOpen(false);
          }}
          className="block w-full text-left px-3 py-2 text-gray-700 hover:text-[#ffcfe7] hover:bg-gray-50 transition-colors duration-200"
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

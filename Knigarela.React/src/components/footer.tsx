"use client"

import Link from "next/link"
import { Facebook, Instagram } from "lucide-react"

export function Footer() {
    return (
        <footer className="w-full px-4 py-12" style={{ backgroundColor: "var(--knigarela-bg)" }}>
            <div className="mx-auto max-w-7xl">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                    {/* Brand Section */}
                    <div className="md:col-span-1">
                        <h3 className="mb-4 text-lg font-semibold" style={{ color: "var(--knigarela-pink)" }}>
                            Книгарела
                        </h3>
                        <p className="text-sm font-light" style={{ color: "#6b6b6b" }}>
                            Твоето приказно време започва тук.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="mb-4 text-sm font-semibold" style={{ color: "#333" }}>
                            Бързи връзки
                        </h4>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    href="/about"
                                    className="text-sm font-light transition-colors hover:text-[var(--knigarela-pink)]"
                                    style={{ color: "#6b6b6b" }}
                                >
                                    За нас
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/all-boxes"
                                    className="text-sm font-light transition-colors hover:text-[var(--knigarela-pink)]"
                                    style={{ color: "#6b6b6b" }}
                                >
                                    Всички кутии
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/faq"
                                    className="text-sm font-light transition-colors hover:text-[var(--knigarela-pink)]"
                                    style={{ color: "#6b6b6b" }}
                                >
                                    Често задавани въпроси
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Legal & Support */}
                    <div>
                        <h4 className="mb-4 text-sm font-semibold" style={{ color: "#333" }}>
                            Информация
                        </h4>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    href="/terms"
                                    className="text-sm font-light transition-colors hover:text-[var(--knigarela-pink)]"
                                    style={{ color: "#6b6b6b" }}
                                >
                                    Общи условия
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/privacy"
                                    className="text-sm font-light transition-colors hover:text-[var(--knigarela-pink)]"
                                    style={{ color: "#6b6b6b" }}
                                >
                                    Политика за поверителност
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/contacts"
                                    className="text-sm font-light transition-colors hover:text-[var(--knigarela-pink)]"
                                    style={{ color: "#6b6b6b" }}
                                >
                                    Контакти
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Social Media */}
                    <div>
                        <h4 className="mb-4 text-sm font-semibold" style={{ color: "#333" }}>
                            Последвайте ни
                        </h4>
                        <div className="flex gap-4">
                            <a
                                href="https://www.facebook.com/559944393863294"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-[var(--knigarela-pink-light)]"
                                style={{ backgroundColor: "rgba(209, 118, 163, 0.1)" }}
                                aria-label="Facebook"
                            >
                                <Facebook className="h-5 w-5" style={{ color: "var(--knigarela-pink)" }} />
                            </a>
                            <a
                                href="https://www.instagram.com/kni.ga.rela"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-[var(--knigarela-pink-light)]"
                                style={{ backgroundColor: "rgba(209, 118, 163, 0.1)" }}
                                aria-label="Instagram"
                            >
                                <Instagram className="h-5 w-5" style={{ color: "var(--knigarela-pink)" }} />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-8 border-t pt-8 text-center" style={{ borderColor: "rgba(209, 118, 163, 0.2)" }}>
                    <p className="text-sm font-light" style={{ color: "#6b6b6b" }}>
                        © {new Date().getFullYear()} Книгарела – Всички права запазени.
                    </p>
                </div>
            </div>
        </footer>
    )
}

import { Mail, Phone, Clock } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function ContactsPage() {
    return (
                <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-12 text-center">
                        <h1 className="mb-4 text-4xl font-bold text-[var(--knigarela-pink)]">Свържете се с нас</h1>
                        <p className="text-lg text-gray-600">Имате въпрос? Ние сме тук, за да ви помогнем!</p>
                    </div>

                    <div className="grid gap-8 lg:grid-cols-1">

                        {/* Contact Information */}
                        <div className="space-y-6">
                            <div className="rounded-lg border border-gray-200 bg-[var(--knigarela-bg)] p-6 shadow-sm">
                                <h2 className="mb-6 text-2xl font-semibold text-[var(--knigarela-pink)]">Информация за контакт</h2>

                                <div className="space-y-6">
                                    {/* Email */}
                                    <div className="flex items-start gap-4">
                                        <div className="rounded-full bg-white p-3 shadow-sm">
                                            <Mail className="h-6 w-6 text-[var(--knigarela-pink)]" />
                                        </div>
                                        <div>
                                            <h3 className="mb-1 font-semibold text-gray-900">Имейл</h3>
                                            <a href="mailto:knigarela@gmail.com" className="text-[var(--knigarela-pink)] hover:underline">
                                                knigarela@gmail.com
                                            </a>
                                        </div>
                                    </div>

                                    {/* Phone */}
                                    <div className="flex items-start gap-4">
                                        <div className="rounded-full bg-white p-3 shadow-sm">
                                            <Phone className="h-6 w-6 text-[var(--knigarela-pink)]" />
                                        </div>
                                        <div>
                                            <h3 className="mb-1 font-semibold text-gray-900">Телефон</h3>
                                            <a href="tel:+359899137603" className="text-[var(--knigarela-pink)] hover:underline">
                                                +359 899 137 603
                                            </a>
                                        </div>
                                    </div>

                                    {/* Working Hours */}
                                    {/*<div className="flex items-start gap-4">*/}
                                    {/*    <div className="rounded-full bg-white p-3 shadow-sm">*/}
                                    {/*        <Clock className="h-6 w-6 text-[var(--knigarela-pink)]" />*/}
                                    {/*    </div>*/}
                                    {/*    <div>*/}
                                    {/*        <h3 className="mb-1 font-semibold text-gray-900">Работно време</h3>*/}
                                    {/*        <p className="text-gray-600">Понеделник - Петък: 9:00 - 18:00</p>*/}
                                    {/*        <p className="text-gray-600">Събота - Неделя: Почивни дни</p>*/}
                                    {/*    </div>*/}
                                    {/*</div>*/}
                                </div>
                            </div>

                            {/* Additional Info */}
                            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                                <h3 className="mb-3 font-semibold text-gray-900">Очаквайте отговор</h3>
                                <p className="text-gray-600">
                                    Обикновено отговаряме на всички запитвания в рамките на 24 часа.
                                </p>
                            </div>
                        </div>

                        {/* Contact Form */}
                        {/*<div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">*/}
                        {/*    <h2 className="mb-6 text-2xl font-semibold text-[var(--knigarela-pink)]">Изпратете съобщение</h2>*/}

                        {/*    <form className="space-y-4">*/}
                        {/*        <div>*/}
                        {/*            <label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-700">*/}
                        {/*                Име*/}
                        {/*            </label>*/}
                        {/*            <input*/}
                        {/*                type="text"*/}
                        {/*                id="name"*/}
                        {/*                name="name"*/}
                        {/*                required*/}
                        {/*                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-[var(--knigarela-pink)] focus:outline-none focus:ring-2 focus:ring-[var(--knigarela-pink)] focus:ring-opacity-20"*/}
                        {/*            />*/}
                        {/*        </div>*/}

                        {/*        <div>*/}
                        {/*            <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">*/}
                        {/*                Имейл*/}
                        {/*            </label>*/}
                        {/*            <input*/}
                        {/*                type="email"*/}
                        {/*                id="email"*/}
                        {/*                name="email"*/}
                        {/*                required*/}
                        {/*                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-[var(--knigarela-pink)] focus:outline-none focus:ring-2 focus:ring-[var(--knigarela-pink)] focus:ring-opacity-20"*/}
                        {/*            />*/}
                        {/*        </div>*/}

                        {/*        <div>*/}
                        {/*            <label htmlFor="phone" className="mb-1 block text-sm font-medium text-gray-700">*/}
                        {/*                Телефон (по избор)*/}
                        {/*            </label>*/}
                        {/*            <input*/}
                        {/*                type="tel"*/}
                        {/*                id="phone"*/}
                        {/*                name="phone"*/}
                        {/*                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-[var(--knigarela-pink)] focus:outline-none focus:ring-2 focus:ring-[var(--knigarela-pink)] focus:ring-opacity-20"*/}
                        {/*            />*/}
                        {/*        </div>*/}

                        {/*        <div>*/}
                        {/*            <label htmlFor="subject" className="mb-1 block text-sm font-medium text-gray-700">*/}
                        {/*                Тема*/}
                        {/*            </label>*/}
                        {/*            <input*/}
                        {/*                type="text"*/}
                        {/*                id="subject"*/}
                        {/*                name="subject"*/}
                        {/*                required*/}
                        {/*                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-[var(--knigarela-pink)] focus:outline-none focus:ring-2 focus:ring-[var(--knigarela-pink)] focus:ring-opacity-20"*/}
                        {/*            />*/}
                        {/*        </div>*/}

                        {/*        <div>*/}
                        {/*            <label htmlFor="message" className="mb-1 block text-sm font-medium text-gray-700">*/}
                        {/*                Съобщение*/}
                        {/*            </label>*/}
                        {/*            <textarea*/}
                        {/*                id="message"*/}
                        {/*                name="message"*/}
                        {/*                rows={5}*/}
                        {/*                required*/}
                        {/*                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-[var(--knigarela-pink)] focus:outline-none focus:ring-2 focus:ring-[var(--knigarela-pink)] focus:ring-opacity-20"*/}
                        {/*            />*/}
                        {/*        </div>*/}

                        {/*        <button*/}
                        {/*            type="submit"*/}
                        {/*            className="w-full rounded-md bg-[var(--knigarela-pink)] px-6 py-3 font-semibold text-white transition-colors hover:opacity-90"*/}
                        {/*        >*/}
                        {/*            Изпрати съобщение*/}
                        {/*        </button>*/}
                        {/*    </form>*/}
                        {/*</div>*/}
                    </div>
                </div>
    )
}

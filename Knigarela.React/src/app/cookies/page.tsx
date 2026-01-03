"use client"

import { Button } from "@/components/ui/button"
import "vanilla-cookieconsent/dist/cookieconsent.css";
import * as CookieConsent from "vanilla-cookieconsent";
export default function CookiesPage() {
    const handleShowPreferences = () => {
        CookieConsent.showPreferences();
    }

    return (
            <div className="mx-auto max-w-4xl px-4 py-12 md:py-16">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="mb-4 text-4xl font-bold text-balance" style={{ color: "var(--knigarela-pink)" }}>
                        🍪 Политика за бисквитки
                    </h1>
                    <p className="text-sm text-gray-600">Последна актуализация: {new Date("01.25.2026").toLocaleDateString("bg-BG")}</p>
                </div>

                {/* Content */}
                <div className="rounded-lg bg-white">
                    <div className="prose prose-sm max-w-none">
                        <p className="leading-relaxed text-gray-700">
                            Настоящата Политика за бисквитки описва как „Книгарела" използва бисквитки и подобни технологии на
                            уебсайта knigarela.com, в съответствие с Регламент (ЕС) 2016/679 (GDPR) и Закона за електронните
                            съобщения.
                        </p>

                        <h2 className="mb-4 mt-8 text-2xl font-semibold" style={{ color: "var(--knigarela-pink)" }}>
                            1. Какво представляват бисквитките
                        </h2>
                        <p className="leading-relaxed text-gray-700">
                            Бисквитките са малки текстови файлове, които се запазват на Вашето устройство при посещение на даден
                            уебсайт. Те позволяват сайтът да функционира коректно, както и да се анализира и подобрява потребителското
                            изживяване.
                        </p>

                        <h2 className="mb-4 mt-8 text-2xl font-semibold" style={{ color: "var(--knigarela-pink)" }}>
                            2. Какви бисквитки използваме
                        </h2>

                        <h3 className="mb-3 mt-6 text-xl" style={{ color: "var(--knigarela-pink)" }}>2.1. Задължителни (необходими) бисквитки</h3>
                        <p className="leading-relaxed text-gray-700">
                            Тези бисквитки са необходими за нормалната работа на сайта и не могат да бъдат изключени.
                        </p>
                        <p className="mt-2 leading-relaxed text-gray-700">Те се използват за:</p>
                        <ul className="mt-2 list-inside list-disc space-y-1 text-gray-700">
                            <li>управление на сесията</li>
                            <li>работа на количката</li>
                            <li>вход в потребителски профил</li>
                            <li>защита и сигурност</li>
                        </ul>
                        <p className="mt-2 text-sm italic text-gray-600">Правно основание: легитимен интерес.</p>

                        <h3 className="mb-3 mt-6 text-xl" style={{ color: "var(--knigarela-pink)" }}>
                            2.2. Аналитични бисквитки (Google Analytics)
                        </h3>
                        <p className="leading-relaxed text-gray-700">Използваме Google Analytics, за да анализираме:</p>
                        <ul className="mt-2 list-inside list-disc space-y-1 text-gray-700">
                            <li>посещаемостта на сайта</li>
                            <li>поведението на потребителите</li>
                            <li>ефективността на съдържанието</li>
                        </ul>
                        <p className="mt-2 leading-relaxed text-gray-700">Тези бисквитки ни помагат да подобряваме сайта си.</p>
                        <p className="mt-2 text-sm italic text-gray-600">Правно основание: изрично съгласие.</p>

                        <h3 className="mb-3 mt-6 text-xl" style={{ color: "var(--knigarela-pink)" }}>
                            2.3. Маркетингови бисквитки (Meta – Facebook / Instagram)
                        </h3>
                        <p className="leading-relaxed text-gray-700">Сайтът използва Meta Pixel, който позволява:</p>
                        <ul className="mt-2 list-inside list-disc space-y-1 text-gray-700">
                            <li>измерване на ефективността на рекламите</li>
                            <li>показване на персонализирани реклами</li>
                        </ul>
                        <p className="mt-2 leading-relaxed text-gray-700">
                            Meta може да комбинира тази информация с Вашия профил в съответната социална мрежа.
                        </p>
                        <p className="mt-2 text-sm italic text-gray-600">Правно основание: изрично съгласие.</p>

                        <h2 className="mb-4 mt-8 text-2xl font-semibold" style={{ color: "var(--knigarela-pink)" }}>
                            3. Управление на бисквитките
                        </h2>
                        <p className="leading-relaxed text-gray-700">
                            При първото Ви посещение на сайта Ви се показва cookie banner, чрез който можете:
                        </p>
                        <ul className="mt-2 list-inside list-disc space-y-1 text-gray-700">
                            <li>да приемете всички бисквитки</li>
                            <li>да откажете незадължителните</li>
                            <li>да направите индивидуален избор</li>
                        </ul>
                        <p className="mt-4 leading-relaxed text-gray-700">
                            Можете по всяко време да промените настройките си чрез настройките на браузъра или чрез бутона „Настройки
                            на бисквитките" в сайта.
                        </p>                       

                        <h2 className="mb-4 mt-8 text-2xl font-semibold" style={{ color: "var(--knigarela-pink)" }}>
                            4. Срок на съхранение
                        </h2>
                        <p className="leading-relaxed text-gray-700">
                            Срокът на съхранение на бисквитките зависи от техния тип и може да бъде:
                        </p>
                        <ul className="mt-2 list-inside list-disc space-y-1 text-gray-700">
                            <li>сесийни (изтриват се при затваряне на браузъра)</li>
                            <li>постоянни (съхраняват се за определен период)</li>
                        </ul>

                        <h2 className="mb-4 mt-8 text-2xl font-semibold" style={{ color: "var(--knigarela-pink)" }}>
                            5. Промени в политиката
                        </h2>
                        <p className="leading-relaxed text-gray-700">
                            Запазваме правото да актуализираме настоящата Политика за бисквитки. Всички промени ще бъдат публикувани
                            на тази страница.
                        </p>

                        <h2 className="mb-4 mt-8 text-2xl font-semibold" style={{ color: "var(--knigarela-pink)" }}>
                            6. Контакти
                        </h2>
                        <p className="leading-relaxed text-gray-700">
                            📧{" "}
                            <a href="mailto:knigarela@gmail.com" className="text-[var(--knigarela-pink)] hover:underline">
                                knigarela@gmail.com
                            </a>
                        </p>
                    </div>
                    <div className="my-6 flex justify-center">
                        <Button
                            onClick={handleShowPreferences}
                            size="lg"
                            className="bg-[var(--knigarela-pink)] text-white hover:bg-[var(--knigarela-pink)]/90"
                        >
                            Настройки на бисквитките
                        </Button>
                    </div>
                </div>
            </div>
    )
}

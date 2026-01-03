export default function FAQPage() {
    return (
        <>
                <div className="mx-auto max-w-4xl">
                    {/* Header */}
                    <div className="mb-12 text-center">
                        <h1 className="mb-4 text-4xl font-bold text-[var(--knigarela-pink)] md:text-5xl py-2">Често задавани въпроси</h1>
                        <p className="text-lg text-gray-600">
                            Намерете отговори на най-често задаваните въпроси относно нашите кутии с книги
                        </p>
                    </div>

                    {/* FAQ Items */}
                    <div className="space-y-6">
                        {/* Question 1 */}
                        <details className="group rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
                            <summary className="flex cursor-pointer items-start justify-between gap-4 text-left font-semibold text-gray-900 list-none">
                                <span className="text-lg">Как работи абонаментът за книги?</span>
                                <span className="flex-shrink-0 text-[var(--knigarela-pink)] transition-transform group-open:rotate-180">
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </span>
                            </summary>
                            <div className="mt-4 text-gray-600 leading-relaxed">
                                <p>
                                    Абонаментът за книги от Knigarela е лесен и удобен. Всеки месец получавате внимателно подбрана кутия с
                                    книги, доставена директно до вашия дом. Можете да избирате между еднократна поръчка или месечен
                                    абонамент с 10% отстъпка. Абонаментът може да бъде спрян или променен по всяко време от вашия профил.
                                </p>
                            </div>
                        </details>

                        {/* Question 2 */}
                        <details className="group rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
                            <summary className="flex cursor-pointer items-start justify-between gap-4 text-left font-semibold text-gray-900 list-none">
                                <span className="text-lg">Колко време отнема доставката?</span>
                                <span className="flex-shrink-0 text-[var(--knigarela-pink)] transition-transform group-open:rotate-180">
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </span>
                            </summary>
                            <div className="mt-4 text-gray-600 leading-relaxed">
                                <p>
                                    Доставката обикновено отнема между 2-5 работни дни в рамките на цялата страна. След направена поръчка,
                                    вие получавате имейл с потвърждение и проследяващ номер за вашата пратка. Можете да изберете доставка
                                    до ваш адрес или до офис на куриерска фирма за ваше удобство.
                                </p>
                            </div>
                        </details>

                        {/* Question 3 */}
                        <details className="group rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
                            <summary className="flex cursor-pointer items-start justify-between gap-4 text-left font-semibold text-gray-900 list-none">
                                <span className="text-lg">Мога ли да върна или заменя получените книги?</span>
                                <span className="flex-shrink-0 text-[var(--knigarela-pink)] transition-transform group-open:rotate-180">
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </span>
                            </summary>
                            <div className="mt-4 text-gray-600 leading-relaxed">
                                <p>
                                    Да, разбираме, че понякога една книга може да не отговаря на вашите очаквания. Имате право да върнете
                                    или замените книги в рамките на 14 дни от получаването им, при условие че са в оригинално състояние.
                                    Свържете се с нашия екип на{" "}
                                <a href="mailto:knigarela@gmail.com" className="text-[var(--knigarela-pink)] hover:underline">
                                    knigarela@gmail.com
                                </a>{" "}
                                    и ние ще ви помогнем с процеса на връщане или замяна.
                                </p>
                            </div>
                        </details>
                    </div>

                    {/* Contact CTA */}
                    <div className="mt-12 rounded-lg bg-[var(--knigarela-light-pink)] p-8 text-center">
                        <h2 className="mb-3 text-2xl font-bold text-[var(--knigarela-pink)]">Все още имате въпроси?</h2>
                        <p className="mb-6 text-gray-600">Нашият екип е винаги на разположение да ви помогне</p>
                        <a
                            href="/contacts"
                            className="inline-block rounded-lg bg-[var(--knigarela-pink)] px-8 py-3 font-semibold text-white transition-all hover:bg-[var(--knigarela-pink)]/90 hover:shadow-lg"
                        >
                            Свържете се с нас
                        </a>
                    </div>
                </div>
        </>
    )
}

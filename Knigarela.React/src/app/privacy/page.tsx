"use client"
export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-background">
            <div className="mx-auto max-w-4xl px-4 py-12 md:py-16">
                <h1 className="mb-8 text-4xl font-bold" style={{ color: "var(--knigarela-pink)" }}>
                    Политика за поверителност
                </h1>

                <div className="space-y-6 text-foreground">
                    <p className="text-sm text-muted-foreground">Последна актуализация: {new Date("01.25.2026").toLocaleDateString("bg-BG")}</p>

                    <p>
                        Настоящата Политика за поверителност описва как „Книгарела" („ние", „нас", „нашият сайт") събира, използва и
                        съхранява лични данни на потребителите при използване на уебсайта knigarela.com и свързаните с него услуги,
                        в съответствие с Регламент (ЕС) 2016/679 (GDPR) и приложимото българско законодателство.
                    </p>

                    <section>
                        <h2 className="mb-3 text-2xl font-semibold" style={{ color: "var(--knigarela-pink)" }}>
                            1. Администратор на лични данни
                        </h2>
                        <p className="mb-2">Администратор: „Книгарела ЕООД"</p>
                        <p>ЕИК: 208267733</p>
                        <p className="mb-2">Имейл за контакт: <a href="mailto:knigarela@gmail.com" className="text-[var(--knigarela-pink)] hover:underline">
                            knigarela@gmail.com
                        </a></p>
                    </section>

                    <section>
                        <h2 className="mb-3 text-2xl font-semibold" style={{ color: "var(--knigarela-pink)" }}>
                            2. Какви лични данни събираме
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <h3 className="mb-2 text-xl font-medium" style={{ color: "var(--knigarela-pink)" }}>
                                    2.1. Данни, предоставяни от потребителя
                                </h3>
                                <ul className="list-inside list-disc space-y-1 pl-4">
                                    <li>Име и фамилия</li>
                                    <li>Имейл адрес</li>
                                    <li>Телефонен номер</li>
                                    <li>Адрес за доставка</li>
                                    <li>Данни за поръчки и абонаменти</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="mb-2 text-xl font-medium" style={{ color: "var(--knigarela-pink)" }}>
                                    2.2. Данни за потребителски профил
                                </h3>
                                <ul className="list-inside list-disc space-y-1 pl-4">
                                    <li>История на поръчки</li>
                                    <li>Съдържание на количка</li>
                                    <li>Статус на абонамент</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="mb-2 text-xl font-medium" style={{ color: "var(--knigarela-pink)" }}>
                                    2.3. Данни за бюлетин (newsletter)
                                </h3>
                                <ul className="list-inside list-disc space-y-1 pl-4">
                                    <li>Имейл адрес</li>
                                    <li>Дата и час на записване</li>
                                    <li>Източник на записване (форма на сайта)</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="mb-2 text-xl font-medium" style={{ color: "var(--knigarela-pink)" }}>
                                    2.4. Автоматично събирани технически данни
                                </h3>
                                <ul className="list-inside list-disc space-y-1 pl-4">
                                    <li>IP адрес</li>
                                    <li>Тип браузър и устройство</li>
                                    <li>Операционна система</li>
                                    <li>Посетени страници и действия в сайта</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="mb-3 text-2xl font-semibold" style={{ color: "var(--knigarela-pink)" }}>
                            3. Бисквитки (Cookies)
                        </h2>
                        <p className="mb-4">Сайтът използва бисквитки и подобни технологии, които могат да бъдат:</p>

                        <div className="space-y-4">
                            <div>
                                <h3 className="mb-2 text-xl font-medium" style={{ color: "var(--knigarela-pink)" }}>
                                    3.1. Задължителни (необходими)
                                </h3>
                                <p className="mb-2">Тези бисквитки са необходими за нормалната работа на сайта, като:</p>
                                <ul className="list-inside list-disc space-y-1 pl-4">
                                    <li>запазване на сесия</li>
                                    <li>количка</li>
                                    <li>логин функционалност</li>
                                </ul>
                                <p className="mt-2">Те не могат да бъдат изключени.</p>
                            </div>

                            <div>
                                <h3 className="mb-2 text-xl font-medium" style={{ color: "var(--knigarela-pink)" }}>
                                    3.2. Аналитични бисквитки – Google Analytics
                                </h3>
                                <p className="mb-2">
                                    Използваме Google Analytics за анализ на посещаемостта и поведението на потребителите с цел
                                    подобряване на услугите.
                                </p>
                                <p className="mb-2">Google Analytics събира данни като:</p>
                                <ul className="list-inside list-disc space-y-1 pl-4">
                                    <li>посетени страници</li>
                                    <li>продължителност на посещение</li>
                                    <li>източник на трафик</li>
                                </ul>
                                <p className="mt-2">Данните се обработват в обобщен и анонимен вид, доколкото е възможно.</p>
                            </div>

                            <div>
                                <h3 className="mb-2 text-xl font-medium" style={{ color: "var(--knigarela-pink)" }}>
                                    3.3. Маркетингови бисквитки – Meta (Facebook / Instagram)
                                </h3>
                                <p className="mb-2">Сайтът използва Meta Pixel, който ни позволява:</p>
                                <ul className="list-inside list-disc space-y-1 pl-4">
                                    <li>да измерваме ефективността на рекламите</li>
                                    <li>да показваме персонализирани реклами в Meta платформи</li>
                                </ul>
                                <p className="mt-2">
                                    Meta може да комбинира тези данни с информация от Вашия профил в съответната социална мрежа.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="mb-3 text-2xl font-semibold" style={{ color: "var(--knigarela-pink)" }}>
                            4. Newsletter и маркетингови съобщения
                        </h2>
                        <p className="mb-2">При записване за нашия бюлетин, ние обработваме Вашия имейл адрес с цел:</p>
                        <ul className="list-inside list-disc space-y-1 pl-4">
                            <li>изпращане на новини</li>
                            <li>информация за нови продукти и абонаменти</li>
                            <li>промоционални кампании</li>
                        </ul>
                        <div className="mt-3 rounded-lg bg-[var(--knigarela-light)] p-4">
                            <p className="font-medium">Важно:</p>
                            <ul className="mt-2 list-inside list-disc space-y-1 pl-4">
                                <li>Записването за бюлетин става само с изрично съгласие</li>
                                <li>Можете да се отпишете по всяко време чрез линка във всеки имейл или като се свържете с нас</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <h2 className="mb-3 text-2xl font-semibold" style={{ color: "var(--knigarela-pink)" }}>
                            5. Цели на обработването
                        </h2>
                        <p className="mb-2">Обработваме личните данни за следните цели:</p>
                        <ul className="list-inside list-disc space-y-1 pl-4">
                            <li>Изпълнение и управление на поръчки</li>
                            <li>Доставка на продукти</li>
                            <li>Управление на абонаменти</li>
                            <li>Комуникация с клиенти</li>
                            <li>Изпращане на бюлетин (при съгласие)</li>
                            <li>Анализ и подобряване на сайта</li>
                            <li>Маркетинг и реклама (при съгласие)</li>
                            <li>Спазване на законови задължения</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="mb-3 text-2xl font-semibold" style={{ color: "var(--knigarela-pink)" }}>
                            6. Правно основание за обработване
                        </h2>
                        <p className="mb-2">Обработването се извършва на базата на:</p>
                        <ul className="list-inside list-disc space-y-1 pl-4">
                            <li>Изпълнение на договор</li>
                            <li>Законно задължение</li>
                            <li>Легитимен интерес</li>
                            <li>Изрично дадено съгласие</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="mb-3 text-2xl font-semibold" style={{ color: "var(--knigarela-pink)" }}>
                            7. Споделяне на данни с трети лица
                        </h2>
                        <p className="mb-2">Личните данни могат да бъдат споделяни с:</p>
                        <ul className="list-inside list-disc space-y-1 pl-4">
                            <li>Курирски компании (за доставки)</li>
                            <li>Платежни доставчици (без достъп до картови данни)</li>
                            <li>Доставчици на аналитични и маркетингови услуги (Google, Meta)</li>
                            <li>Хостинг и IT доставчици</li>
                        </ul>
                        <p className="mt-2">Всички трети страни обработват данните при спазване на GDPR.</p>
                    </section>

                    <section>
                        <h2 className="mb-3 text-2xl font-semibold" style={{ color: "var(--knigarela-pink)" }}>
                            8. Срок за съхранение
                        </h2>
                        <ul className="list-inside list-disc space-y-1 pl-4">
                            <li>Данни за поръчки – съгласно счетоводното законодателство</li>
                            <li>Данни за профили – до изтриване от потребителя</li>
                            <li>Данни за newsletter – до оттегляне на съгласието</li>
                            <li>Аналитични данни – съгласно сроковете на съответните услуги</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="mb-3 text-2xl font-semibold" style={{ color: "var(--knigarela-pink)" }}>
                            9. Права на потребителите
                        </h2>
                        <p className="mb-2">Имате право да:</p>
                        <ul className="list-inside list-disc space-y-1 pl-4">
                            <li>получите информация за личните си данни</li>
                            <li>поискате корекция</li>
                            <li>поискате изтриване</li>
                            <li>ограничите обработването</li>
                            <li>възразите срещу обработване</li>
                            <li>поискате преносимост</li>
                            <li>оттеглите съгласие по всяко време</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="mb-3 text-2xl font-semibold" style={{ color: "var(--knigarela-pink)" }}>
                            10. Сигурност на данните
                        </h2>
                        <p>
                            Прилагаме технически и организационни мерки за защита на личните данни срещу неоторизиран достъп, загуба
                            или злоупотреба.
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-3 text-2xl font-semibold" style={{ color: "var(--knigarela-pink)" }}>
                            11. Промени в политиката
                        </h2>
                        <p>
                            Запазваме правото да актуализираме настоящата политика. Всички промени ще бъдат публикувани на тази
                            страница.
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-3 text-2xl font-semibold" style={{ color: "var(--knigarela-pink)" }}>
                            12. Контакти
                        </h2>
                        <p> 📧{" "}
                            <a href="mailto:knigarela@gmail.com" className="text-[var(--knigarela-pink)] hover:underline">
                                knigarela@gmail.com
                            </a></p>
                    </section>
                </div>
            </div>
        </div>
    )
}

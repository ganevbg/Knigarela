export default function TermsPage() {
    return (
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
            <h1 className="mb-8 text-4xl font-bold text-[var(--knigarela-pink)]">
                Общи условия за ползване на сайта и онлайн покупка
            </h1>

            <div className="space-y-6 text-gray-700">
                <p className="text-sm text-gray-500">Последна актуализация: {new Date("01.25.2026").toLocaleDateString("bg-BG")}</p>

                <p>
                    Настоящите Общи условия уреждат правилата за използване на уебсайта knigarela.com („Сайта") и условията за
                    покупка на продукти и абонаменти, предлагани от „Книгарела" („Ние", „Търговец"). С използването на Сайта
                    и/или извършването на поръчка Вие („Клиент", „Потребител") се съгласявате с настоящите Общи условия.
                </p>

                <section>
                    <h2 className="mb-4 text-2xl font-semibold text-[var(--knigarela-pink)]">1. Данни за търговеца</h2>
                    <div className="space-y-2">
                        <p>
                            <strong>Търговец:</strong> „Книгарела ЕООД"
                        </p>
                        <p>
                            <strong>Имейл:</strong>  <a href="mailto:knigarela@gmail.com" className="text-[var(--knigarela-pink)] hover:underline">
                                knigarela@gmail.com
                            </a>
                        </p>
                        <p>
                            <strong>Телефон:</strong> <a href="tel:+359899137603" className="text-[var(--knigarela-pink)] hover:underline">
                                +359899137603
                            </a>
                        </p>
                        <p>
                            <strong>Адрес:</strong> БЪЛГАРИЯ, обл. Бургас, с. Твърдица (8100), ул. 18-та  №3
                        </p>
                    </div>
                </section>

                <section>
                    <h2 className="mb-4 text-2xl font-semibold text-[var(--knigarela-pink)]">2. Предмет</h2>
                    <div className="space-y-2">
                        <p>
                            <strong>2.1.</strong> Сайтът предоставя възможност за поръчка на книжни кутии и абонаменти, предлагани
                            от Търговеца.
                        </p>
                        <p>
                            <strong>2.2.</strong> Поръчките се извършват без необходимост от регистрация.
                        </p>
                        <p>
                            <strong>2.3.</strong> Настоящите Общи условия представляват договор за покупка от разстояние съгласно
                            действащото българско законодателство.
                        </p>
                    </div>
                </section>

                <section>
                    <h2 className="mb-4 text-2xl font-semibold text-[var(--knigarela-pink)]">3. Поръчка</h2>
                    <div className="space-y-2">
                        <p>
                            <strong>3.1.</strong> За да направи поръчка, Клиентът попълва необходимите данни за доставка и
                            контакт.
                        </p>
                        <p>
                            <strong>3.2.</strong> Клиентът носи отговорност за коректността и пълнотата на предоставените данни.
                        </p>
                        <p>
                            <strong>3.3.</strong> След направена поръчка Клиентът получава потвърждение по имейл.
                        </p>
                    </div>
                </section>

                <section>
                    <h2 className="mb-4 text-2xl font-semibold text-[var(--knigarela-pink)]">4. Цени</h2>
                    <div className="space-y-2">
                        <p>
                            <strong>4.1.</strong> Всички цени в Сайта са посочени в евро (EUR) като основна валута.
                        </p>
                        <p>
                            <strong>4.2.</strong> До края на 2026 г. цените могат да бъдат визуализирани и в български лева (BGN)
                            само с информативна цел, съгласно приложимото законодателство.
                        </p>
                        <p>
                            <strong>4.3.</strong> При разминаване между визуализираната цена в BGN и цената в EUR, валидна и
                            обвързваща е цената, посочена в евро (EUR).
                        </p>
                        <p>
                            <strong>4.4.</strong> Преизчисляването от евро в български лева се извършва по официалния фиксиран
                            курс, определен от Българската народна банка.
                        </p>
                        <p>
                            <strong>4.5.</strong> Цената за доставка (ако е приложима) се посочва преди финализиране на поръчката.
                        </p>
                    </div>
                </section>

                <section>
                    <h2 className="mb-4 text-2xl font-semibold text-[var(--knigarela-pink)]">5. Плащане</h2>
                    <div className="space-y-2">
                        <p>
                            <strong>5.1.</strong> Към момента всички поръчки се заплащат чрез наложен платеж при получаване на
                            пратката.
                        </p>
                        <p>
                            <strong>5.2.</strong> Търговецът не приема картови или други онлайн плащания.
                        </p>
                    </div>
                </section>

                <section>
                    <h2 className="mb-4 text-2xl font-semibold text-[var(--knigarela-pink)]">6. Доставка</h2>
                    <div className="space-y-2">
                        <p>
                            <strong>6.1.</strong> Доставките се извършват чрез куриерска фирма СПИДИ до посочен от Клиента адрес,
                            офис или автомат.
                        </p>
                        <p>
                            <strong>6.2.</strong> Срокът за доставка се посочва при поръчка или в потвърждението.
                        </p>
                        <p>
                            <strong>6.3.</strong> Възможни са забавяния по независещи от Търговеца причини (куриер, празници,
                            форсмажор).
                        </p>
                    </div>
                </section>

                <section>
                    <h2 className="mb-4 text-2xl font-semibold text-[var(--knigarela-pink)]">7. Абонаменти</h2>
                    <div className="space-y-2">
                        <p>
                            <strong>7.1.</strong> Абонаментът представлява периодично получаване на книжна кутия.
                        </p>
                        <p>
                            <strong>7.2.</strong> Абонаментът се подновява автоматично, освен ако Клиентът не заяви отказ.
                        </p>
                        <p>
                            <strong>7.3.</strong> При всяко ново изпращане на кутия по активен абонамент Клиентът дължи заплащане
                            чрез наложен платеж.
                        </p>
                        <p>
                            <strong>7.4.</strong> Клиентът може да прекрати абонамента си, като се свърже с Търговеца на{" "}
                            <a href="mailto:knigarela@gmail.com" className="text-[var(--knigarela-pink)] hover:underline">
                                knigarela@gmail.com
                            </a>{" "}
                            преди подготовката на следващата кутия за изпращане.
                        </p>
                    </div>
                </section>

                <section>
                    <h2 className="mb-4 text-2xl font-semibold text-[var(--knigarela-pink)]">
                        8. Преглед, тест и рекламации
                    </h2>
                    <div className="space-y-2">
                        <p>
                            <strong>8.1.</strong> Пратките не подлежат на преглед и тест при доставка.
                        </p>
                        <p>
                            <strong>8.2.</strong> Поради естеството на продукта, след отваряне на кутията нейната цялост се счита
                            за нарушена.
                        </p>
                        <p>
                            <strong>8.3.</strong> Рекламации се приемат единствено при:
                        </p>
                        <ul className="ml-6 list-disc space-y-1">
                            <li>липсващ продукт;</li>
                            <li>повреда, причинена по време на доставка, удостоверена с протокол от куриера.</li>
                        </ul>
                        <p>
                            Рекламации се заявяват на{" "}
                            <a href="mailto:knigarela@gmail.com" className="text-[var(--knigarela-pink)] hover:underline">
                                knigarela@gmail.com
                            </a>{" "}
                            с описание и снимки.
                        </p>
                    </div>
                </section>

                <section>
                    <h2 className="mb-4 text-2xl font-semibold text-[var(--knigarela-pink)]">9. Право на отказ</h2>
                    <div className="space-y-2">
                        <p>
                            <strong>9.1.</strong> Клиентът има право да се откаже от договора в срок от 14 дни от получаване на
                            пратката само ако кутията не е отваряна и е с ненарушена цялост, съгласно Закона за защита на
                            потребителите.
                        </p>
                        <p>
                            <strong>9.2.</strong> След отваряне на кутията правото на отказ не се прилага, тъй като продуктът не
                            може да бъде върнат в първоначалния си търговски вид.
                        </p>
                        <p>
                            <strong>9.3.</strong> Разходите за връщане са за сметка на Клиента, освен ако изрично не е уговорено
                            друго.
                        </p>
                    </div>
                </section>

                <section>
                    <h2 className="mb-4 text-2xl font-semibold text-[var(--knigarela-pink)]">10. Отговорност</h2>
                    <div className="space-y-2">
                        <p>
                            <strong>10.1.</strong> Търговецът не носи отговорност за вреди, причинени от предоставяне на неверни
                            данни от Клиента.
                        </p>
                        <p>
                            <strong>10.2.</strong> Търговецът не носи отговорност за временна недостъпност на Сайта по технически
                            причини.
                        </p>
                        <p>
                            <strong>10.3.</strong> Отговорността на Търговеца е ограничена до стойността на съответната поръчка.
                        </p>
                    </div>
                </section>

                <section>
                    <h2 className="mb-4 text-2xl font-semibold text-[var(--knigarela-pink)]">
                        11. Интелектуална собственост
                    </h2>
                    <p>
                        Всички текстове, изображения, дизайн и съдържание в Сайта са собственост на Търговеца и не могат да
                        бъдат използвани без изрично писмено съгласие.
                    </p>
                </section>

                <section>
                    <h2 className="mb-4 text-2xl font-semibold text-[var(--knigarela-pink)]">12. Лични данни</h2>
                    <p>Обработването на лични данни се извършва съгласно:</p>
                    <ul className="ml-6 list-disc space-y-1">
                        <li>
                            <a href="/privacy" className="text-[var(--knigarela-pink)] hover:underline">
                                Политика за поверителност
                            </a>
                        </li>
                        <li>
                            <a href="/cookies" className="text-[var(--knigarela-pink)] hover:underline">
                                Политика за бисквитки
                            </a>
                        </li>
                    </ul>
                </section>

                <section>
                    <h2 className="mb-4 text-2xl font-semibold text-[var(--knigarela-pink)]">13. Промени в общите условия</h2>
                    <p>
                        Търговецът си запазва правото да актуализира настоящите Общи условия. Промените влизат в сила от
                        публикуването им в Сайта.
                    </p>
                </section>

                <section>
                    <h2 className="mb-4 text-2xl font-semibold text-[var(--knigarela-pink)]">14. Приложимо право</h2>
                    <p>
                        За всички неуредени въпроси се прилага българското законодателство. Споровете се решават по взаимно
                        съгласие, а при невъзможност – от компетентния български съд.
                    </p>
                </section>

                <section>
                    <h2 className="mb-4 text-2xl font-semibold text-[var(--knigarela-pink)]">15. Контакти</h2>
                    <div className="space-y-2">
                        <p>
                            📧{" "}
                            <a href="mailto:knigarela@gmail.com" className="text-[var(--knigarela-pink)] hover:underline">
                                knigarela@gmail.com
                            </a>
                        </p>
                        <p>
                            ☎{" "}
                            <a href="phoneto:+359899137603" className="text-[var(--knigarela-pink)] hover:underline">
                                 +359899137603
                            </a>
                        </p>
                    </div>
                </section>
            </div>
        </div>
    )
}

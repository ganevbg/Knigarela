import { Heart, Sparkles, Users } from "lucide-react"

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-white">

            {/* Mission Section */}
            <section className="mx-auto max-w-6xl px-4 py-16">
                <div className="grid gap-12 md:grid-cols-2 md:items-center">
                    <div>
                        <h2 className="mb-4 text-3xl font-bold" style={{ color: "var(--knigarela-pink)" }}>
                            Нашата мисия
                        </h2>
                        <p className="mb-4 leading-relaxed text-gray-700">
                            Книгарела е създадена от страстни читатели за читатели. Вярваме, че всяка книга е врата към нов свят, а
                            четенето е едно от най-красивите пътешествия, които можем да предприемем.
                        </p>
                        <p className="leading-relaxed text-gray-700">
                            Нашата мисия е да донесем магията на четенето в дома на всеки книголюбец чрез грижливо подбрани книжни
                            кутии, които изненадват, вдъхновяват и радват.
                        </p>
                    </div>
                    <div className="grid gap-6">
                        <div className="flex gap-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                            <Heart className="h-8 w-8 flex-shrink-0" style={{ color: "var(--knigarela-pink)" }} />
                            <div>
                                <h3 className="mb-2 font-semibold text-gray-900">Направено с любов</h3>
                                <p className="text-sm text-gray-600">
                                    Всяка кутия е грижливо подготвена с внимание към детайла и истинска любов към книгите
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                            <Sparkles className="h-8 w-8 flex-shrink-0" style={{ color: "var(--knigarela-pink)" }} />
                            <div>
                                <h3 className="mb-2 font-semibold text-gray-900">Уникални селекции</h3>
                                <p className="text-sm text-gray-600">
                                    Подбираме книги, които заслужават вниманието ви - от бестселъри до скрити бижута
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="px-4 py-16" style={{ backgroundColor: "var(--knigarela-bg)" }}>
                <div className="mx-auto max-w-6xl">
                    <h2 className="mb-12 text-center text-3xl font-bold" style={{ color: "var(--knigarela-pink)" }}>
                        Как работи?
                    </h2>
                    <div className="grid gap-8 md:grid-cols-3">
                        <div className="text-center">
                            <div className="mb-4 flex justify-center">
                                <div
                                    className="flex h-16 w-16 items-center justify-center rounded-full"
                                    style={{ backgroundColor: "var(--knigarela-pink)", color: "white" }}
                                >
                                    <span className="text-2xl font-bold">1</span>
                                </div>
                            </div>
                            <h3 className="mb-3 text-xl font-semibold text-gray-900">Избери кутия</h3>
                            <p className="text-gray-600">
                                Разгледай нашата текуща колекция и избери кутията, която те вълнува най-много
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="mb-4 flex justify-center">
                                <div
                                    className="flex h-16 w-16 items-center justify-center rounded-full"
                                    style={{ backgroundColor: "var(--knigarela-pink)", color: "white" }}
                                >
                                    <span className="text-2xl font-bold">2</span>
                                </div>
                            </div>
                            <h3 className="mb-3 text-xl font-semibold text-gray-900">Поръчай</h3>
                            <p className="text-gray-600">Избери дали искаш еднократна поръчка или месечен абонамент с отстъпка</p>
                        </div>
                        <div className="text-center">
                            <div className="mb-4 flex justify-center">
                                <div
                                    className="flex h-16 w-16 items-center justify-center rounded-full"
                                    style={{ backgroundColor: "var(--knigarela-pink)", color: "white" }}
                                >
                                    <span className="text-2xl font-bold">3</span>
                                </div>
                            </div>
                            <h3 className="mb-3 text-xl font-semibold text-gray-900">Наслади се</h3>
                            <p className="text-gray-600">Получи красива кутия с книги и започни своето ново приказно пътешествие</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Community Section */}
            <section className="mx-auto max-w-4xl px-4 py-16 text-center">
                <Users className="mx-auto mb-6 h-16 w-16" style={{ color: "var(--knigarela-pink)" }} />
                <h2 className="mb-4 text-3xl font-bold" style={{ color: "var(--knigarela-pink)" }}>
                    Присъедини се към нашата общност
                </h2>
                <p className="mb-8 leading-relaxed text-gray-700">
                    Книгарела е повече от просто услуга - това е общност от хора, които споделят любовта към книгите. Следи ни в
                    социалните мрежи за препоръки, дискусии и специални оферти.
                </p>
                <div className="flex justify-center gap-4">
                    <a
                        href="https://facebook.com/559944393863294"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg border px-6 py-3 font-medium transition-colors hover:bg-gray-50"
                        style={{ borderColor: "var(--knigarela-pink)", color: "var(--knigarela-pink)" }}
                    >
                        Facebook
                    </a>
                    <a
                        href="https://instagram.com/kni.ga.rela"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg px-6 py-3 font-medium text-white transition-colors hover:opacity-90"
                        style={{ backgroundColor: "var(--knigarela-pink)" }}
                    >
                        Instagram
                    </a>
                </div>
            </section>
        </div>
    )
}

"use client";
import { ActiveBox } from "@/components/active-box";
import { PreviousBoxesCarousel } from "@/components/previous-boxes-carousel";

export default function Home() {
    return (
        <>
            <section className="w-full bg-white px-4 py-16">
                <div className="mx-auto max-w-5xl">
                    <ActiveBox />
                </div>
            </section>

            <section className="w-full px-4 py-16" style={{ backgroundColor: "#fff5fa" }}>
                <div className="mx-auto max-w-7xl">
                    <h2 className="mb-12 text-center text-3xl font-semibold md:text-4xl" style={{ color: "#2d2d2d" }}>
                        Предишни кутии
                    </h2>
                    <PreviousBoxesCarousel />
                </div>
            </section>

            <section className="w-full bg-white px-4 py-16">
                <div className="mx-auto max-w-7xl">
                    <h2 className="mb-12 text-center text-3xl font-semibold md:text-4xl" style={{ color: "#2d2d2d" }}>
                        Защо Книгарела?
                    </h2>
                    <div className="grid gap-8 md:grid-cols-3">
                        <div className="text-center">
                            <div className="mb-4 text-5xl">📚</div>
                            <h3 className="mb-2 text-xl font-semibold" style={{ color: "#D176A3" }}>
                                Внимателно подбрани книги
                            </h3>
                            <p className="text-gray-600">Всяка книга е избрана с любов и внимание към детайла</p>
                        </div>
                        <div className="text-center">
                            <div className="mb-4 text-5xl">🎁</div>
                            <h3 className="mb-2 text-xl font-semibold" style={{ color: "#D176A3" }}>
                                Изненади всеки месец
                            </h3>
                            <p className="text-gray-600">Получавайте нови литературни приключения на вашата врата</p>
                        </div>
                        <div className="text-center">
                            <div className="mb-4 text-5xl">💝</div>
                            <h3 className="mb-2 text-xl font-semibold" style={{ color: "#D176A3" }}>
                                Перфектен подарък
                            </h3>
                            <p className="text-gray-600">Идеалният начин да покажете грижа към любителите на книги</p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

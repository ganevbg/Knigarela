"use client"

export function Header() {
    return (
        <header className="w-full px-4 py-2" style={{ backgroundColor: "var(--knigarela-bg)" }}>
            <div className="mx-auto max-w-7xl text-center">
                <div className="mb-2 flex justify-center">
                    <img src="/logo.svg" alt="Книгарела" className="h-20 w-auto" loading="eager" />
                </div>
                <p className="mt-2 text-xl font-light text-[#525252] md:text-2xl">Твоето приказно време започва тук.</p>
            </div>
        </header>
    )
}

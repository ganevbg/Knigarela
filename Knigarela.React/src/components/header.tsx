"use client"

export function Header() {
    return (
        <header className="w-full px-4 py-16" style={{ backgroundColor: "#ffcfe7" }}>
            <div className="mx-auto max-w-7xl text-center">
                <div className="mb-4 flex justify-center">
                    <img src="/logo.svg" alt="Книгарела" className="h-20 w-auto" loading="eager" />
                </div>
                <p className="mt-6 text-xl font-light text-white md:text-2xl">Твоето приказно време започва тук.</p>
            </div>
        </header>
    )
}

import type React from "react"
import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { ToastContainer } from 'react-toastify';
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"],
    variable: "--font-poppins",
})

export const metadata: Metadata = {
    title: "Knigarela – Love for books, in a box",
    description: "Discover curated book subscription boxes delivered monthly",
    generator: "v0.app",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="bg">
            <body className={`${poppins.variable} font-sans antialiased`}>
                <AuthProvider>
                    <CartProvider>
                        <Navbar />
                        <Header />
                        <main className="min-h-screen bg-white">{children}</main>
                        <Footer />
                    </CartProvider>
                </AuthProvider>
                <Analytics />
                <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar
                    newestOnTop
                    closeOnClick
                    draggable
                    pauseOnHover
                    theme="light"
                    style={{ marginTop: "80px" }}
                />
            </body>
        </html>
    );
}
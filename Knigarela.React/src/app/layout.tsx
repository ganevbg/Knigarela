import type React from "react"
import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";

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

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode
// }>) {
//   return (
//     <html lang="en">
//       <body className={`${poppins.variable} font-sans antialiased`}>
//         {children}
//         <Analytics />
//       </body>
//     </html>
//   )
// }

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="bg">
            <body className={`${poppins.variable} font-sans antialiased`}>
                <AuthProvider>
                    <CartProvider>
                        {children}
                    </CartProvider>
                </AuthProvider>
                <Analytics />
            </body>

        </html>
    );
}
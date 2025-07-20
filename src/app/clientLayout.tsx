"use client"

import { Providers } from "@/app/providers"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { motion } from "framer-motion"
import "./globals.css"

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <head>
                <link rel="icon" href="/icon.png" type="image/png" />
                <link rel="manifest" href="/manifest.json" />
                <meta name="theme-color" content="#9900ff" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            </head>
            <body className="scanlines">
                <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[-1]" style={{ backgroundImage: "radial-gradient(circle at 10% 20%, rgba(255, 0, 255, 0.1) 0%, transparent 20%), radial-gradient(circle at 90% 80%, rgba(0, 255, 255, 0.1) 0%, transparent 20%), linear-gradient(to bottom, #2a0066, #1a0044)", backgroundAttachment: "fixed", }}>
                    <div className="w-full h-full retro-grid"></div>
                </div>
                <div className="min-h-screen flex flex-col">
                    <Providers>
                        <Header />
                        <motion.main className="flex-grow" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3, ease: "easeOut" }}>{children}</motion.main>
                        <Footer />
                    </Providers>
                </div>
            </body>
        </html>
    )
}
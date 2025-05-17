import { Providers } from "@/app/providers";
import "./globals.css"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export const metadata = {
    title: "Music Zodiac | Your Musical Astrology",
    description: "Discover your music zodiac signs based on your Spotify listening habits",
}

export default function RootLayout({ children, }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className="scanlines">
                <div className="min-h-screen flex flex-col">
                    <Providers>
                        <Header />
                        <main className="flex-grow">{children}</main>
                        <Footer />
                    </Providers>
                </div>
                <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[-1] retro-grid"></div>
            </body>
        </html>
    )
}
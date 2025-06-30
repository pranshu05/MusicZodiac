import type React from "react"
import { Providers } from "@/app/providers"
import "./globals.css"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: {
        default: "Music Zodiac | Your Musical Astrology",
        template: "%s | Music Zodiac",
    },
    description: "Discover your cosmic musical identity through Last.fm data. Generate your personalized music zodiac chart, find compatible friends, and get AI-powered music recommendations based on your astrological profile.",
    keywords: [
        "music zodiac",
        "musical astrology",
        "last.fm",
        "music recommendations",
        "music compatibility",
        "personalized music",
        "music chart",
        "AI music discovery",
        "music personality",
        "cosmic music",
    ],
    authors: [{ name: "Pranshu05" }],
    creator: "Music Zodiac",
    publisher: "Music Zodiac",
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    metadataBase: new URL("https://musiczodiac.com"),
    alternates: {
        canonical: "/",
    },
    openGraph: {
        type: "website",
        locale: "en_US",
        url: "/",
        title: "Music Zodiac | Your Musical Astrology",
        description: "Discover your cosmic musical identity through Last.fm data. Generate your personalized music zodiac chart and find your musical soulmates.",
        siteName: "Music Zodiac",
        images: [
            {
                url: "/musiczodiac.png",
                width: 400,
                height: 400,
                alt: "Music Zodiac - Your Musical Astrology",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Music Zodiac | Your Musical Astrology",
        description: "Discover your cosmic musical identity through Last.fm data. Generate your personalized music zodiac chart.",
        images: ["/musiczodiac.png"],
        creator: "@pranshu_05",
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
}

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
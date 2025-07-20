import type { Metadata } from "next"
import ClientLayout from "./clientLayout"

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
    return <ClientLayout>{children}</ClientLayout>
}
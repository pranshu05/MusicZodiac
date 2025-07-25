import { authOptions } from "@/utils/auth"
import { getServerSession } from "next-auth"
import { StarChart } from "@/components/chart/star-chart"
import { ChartDetails } from "@/components/chart/chart-details"
import { InsufficientDataError as InsufficientDataErrorComponent } from "@/components/chart/insufficient-data-error"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { ROUTES } from "@/utils/constants"
import type { MusicChartData } from "@/types/lastfm"
import { ShareButtons } from "@/components/profile/share-buttons"
import { generateAndSaveChart } from "@/utils/generate-chart"
import { InsufficientDataError } from "@/lib/lastfm"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Your Music Chart | Music Zodiac",
    description: "View your personalized music zodiac chart based on your Last.fm listening history. Discover your cosmic musical identity and share it with friends.",
    openGraph: {
        title: "Your Music Chart | Music Zodiac",
        description: "View your personalized music zodiac chart based on your Last.fm listening history.",
        images: [
            {
                url: "/musiczodiac.png",
                width: 400,
                height: 400,
                alt: "Music Zodiac Chart",
            },
        ],
    },
    robots: {
        index: false,
        follow: true,
    },
}

export default async function ChartPage() {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
        redirect(ROUTES.HOME)
    }

    let userChart = await prisma.musicChart.findUnique({
        where: {
            userId: session.user.id,
        },
    })

    let insufficientDataDetails = null

    if (!userChart) {
        try {
            const userData = await prisma.user.findUnique({
                where: { id: session.user.id },
            })

            if (!userData) {
                throw new Error("User not found")
            }

            await generateAndSaveChart(userData)
            userChart = await prisma.musicChart.findUnique({
                where: { userId: session.user.id },
            })
        } catch (error) {
            if (error instanceof InsufficientDataError) {
                insufficientDataDetails = error.details
            }
        }
    }

    if (insufficientDataDetails) {
        return (
            <div className="container mx-auto px-4 py-12 pb-24">
                <InsufficientDataErrorComponent details={insufficientDataDetails} />
            </div>
        )
    }

    if (!userChart) {
        throw new Error("Failed to generate or retrieve user chart")
    }

    const chartData = userChart.chartData as unknown as MusicChartData

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        name: `${session.user.name || session.user.username}'s Music Zodiac Chart`,
        description: "A personalized music zodiac chart based on Last.fm listening history",
        creator: { "@type": "Person", name: session.user.name || session.user.username, },
        dateCreated: userChart.generatedAt,
        dateModified: userChart.updatedAt,
    }

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <div className="container mx-auto px-4 py-12 pb-24">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                        <div className="lg:sticky lg:top-24">
                            <div className="bg-gradient-to-br from-purple-900/40 to-fuchsia-900/40 backdrop-blur-md rounded-xl p-8 border border-purple-500/30 box-glow shadow-xl shadow-purple-900/20">
                                <StarChart chartData={chartData} className="max-w-xl mx-auto" />
                                <div className="mt-8 text-center">
                                    <h2 className="text-xl font-bold text-glow-pink mb-4">Share Your Chart</h2>
                                    <ShareButtons username={session.user.username || session.user.id} />
                                </div>
                            </div>
                        </div>
                        <ChartDetails chartData={chartData} username={session.user.name || undefined} />
                    </div>
                </div>
            </div>
        </>
    )
}
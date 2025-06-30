import { authOptions } from "@/utils/auth"
import { getServerSession } from "next-auth"
import { InsufficientDataError as InsufficientDataErrorComponent } from "@/components/chart/insufficient-data-error"
import { DiscoveryEngine } from "@/components/ai/discovery-engine"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { ROUTES } from "@/utils/constants"
import type { MusicChartData } from "@/types/lastfm"
import { generateAndSaveChart } from "@/utils/generate-chart"
import { InsufficientDataError } from "@/lib/lastfm"
import Link from "next/link"
import { Music } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "AI Music Discovery | Music Zodiac",
    description: "Get personalized AI-powered music recommendations based on your cosmic musical profile. Discover new artists and genres that align with your zodiac chart.",
    openGraph: {
        title: "AI Music Discovery | Music Zodiac",
        description: "Get personalized AI-powered music recommendations based on your cosmic musical profile.",
        images: [
            {
                url: "/musiczodiac.png",
                width: 400,
                height: 40,
                alt: "AI Music Discovery - Music Zodiac",
            },
        ],
    },
    robots: {
        index: false,
        follow: true,
    },
}

export default async function DiscoverPage() {
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

            if (!userData) redirect(ROUTES.HOME)

            await generateAndSaveChart(userData)
            userChart = await prisma.musicChart.findUnique({
                where: { userId: session.user.id },
            })
        } catch (error) {
            if (error instanceof InsufficientDataError) {
                insufficientDataDetails = error.details
            } else {
                return (
                    <div className="container mx-auto px-4 py-12 pb-24">
                        <div className="max-w-2xl mx-auto text-center py-12">
                            <div className="bg-gradient-to-br from-purple-900/40 to-fuchsia-900/40 backdrop-blur-md rounded-xl p-8 border border-purple-500/30 box-glow">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-600 to-red-600 flex items-center justify-center box-glow-pink mb-4 mx-auto"><Music size={32} className="text-white" /></div>
                                <h2 className="text-xl font-bold text-white mb-4">Generate Your Chart First</h2>
                                <p className="text-purple-200 mb-6">You need to generate your music zodiac chart before you can discover new music based on your cosmic profile.</p>
                                <Link href={ROUTES.CHART} className="neon-button">Generate My Chart</Link>
                            </div>
                        </div>
                    </div>
                )
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
        return (
            <div className="container mx-auto px-4 py-12 pb-24">
                <div className="max-w-2xl mx-auto text-center py-12">
                    <div className="bg-gradient-to-br from-purple-900/40 to-fuchsia-900/40 backdrop-blur-md rounded-xl p-8 border border-purple-500/30 box-glow">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-600 to-red-600 flex items-center justify-center box-glow-pink mb-4 mx-auto"><Music size={32} className="text-white" /></div>
                        <h2 className="text-xl font-bold text-white mb-4">Chart Generation Failed</h2>
                        <p className="text-purple-200 mb-6">We couldn't generate your music chart. Please try again or contact support if the issue persists.</p>
                        <Link href={ROUTES.CHART} className="neon-button">Try Again</Link>
                    </div>
                </div>
            </div>
        )
    }

    const chartData = userChart.chartData as unknown as MusicChartData

    return (
        <div className="container mx-auto px-4 py-12 pb-24">
            <div className="max-w-7xl mx-auto">
                <DiscoveryEngine chartData={chartData} />
            </div>
        </div>
    )
}
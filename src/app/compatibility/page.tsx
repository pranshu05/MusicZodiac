import { authOptions } from "@/utils/auth"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { ROUTES } from "@/utils/constants"
import type { MusicChartData } from "@/types/lastfm"
import { generateAndSaveChart } from "@/utils/generate-chart"
import Link from "next/link"
import { Users, UserPlus, Music } from "lucide-react"
import { calculateCompatibility } from "@/utils/compatibility"
import { CompatibilityCard } from "@/components/compatibility/compatibility-card"
import { CompatibilityGuide } from "@/components/compatibility/compatibility-guide"
import { InsufficientDataError } from "@/lib/lastfm"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Musical Compatibility | Music Zodiac",
    description: "Discover how your music taste aligns with your friends' cosmic charts. Find musical soulmates and explore compatibility scores based on astrological profiles.",
    openGraph: {
        title: "Musical Compatibility | Music Zodiac",
        description: "Discover how your music taste aligns with your friends' cosmic charts.",
        images: [
            {
                url: "/musiczodiac.png",
                width: 400,
                height: 400,
                alt: "Musical Compatibility - Music Zodiac",
            },
        ],
    },
    robots: {
        index: false,
        follow: true,
    },
}

export default async function CompatibilityPage() {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
        redirect(ROUTES.HOME)
    }

    let userChart = await prisma.musicChart.findUnique({
        where: { userId: session.user.id },
    })

    let hasInsufficientData = false

    if (!userChart) {
        try {
            const userData = await prisma.user.findUnique({
                where: { id: session.user.id }
            })

            if (!userData) redirect(ROUTES.HOME)

            await generateAndSaveChart(userData)
            userChart = await prisma.musicChart.findUnique({
                where: { userId: session.user.id }
            })
        } catch (error) {
            if (error instanceof InsufficientDataError) {
                hasInsufficientData = true
            } else {
                redirect(ROUTES.CHART)
            }
        }
    }

    if (!userChart || hasInsufficientData) {
        return (
            <div className="mx-auto px-4 py-8 space-y-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-white mb-4 text-glow-pink">Musical Compatibility</h1>
                        <p className="text-purple-200">Discover how your music taste aligns with your friends' cosmic charts.</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-900/40 to-fuchsia-900/40 backdrop-blur-md rounded-xl p-8 border border-purple-500/20 box-glow text-center">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-600 to-red-600 flex items-center justify-center box-glow-pink mb-4 mx-auto"><Music size={32} className="text-white" /></div>
                        <h2 className="text-xl font-bold text-white mb-4">Generate Your Chart First</h2>
                        <p className="text-purple-200 mb-6">You need to generate your music zodiac chart before you can check compatibility with friends.</p>
                        <Link href={ROUTES.CHART} className="neon-button">Generate My Chart</Link>
                    </div>
                </div>
            </div>
        )
    }

    const chartData = userChart.chartData as unknown as MusicChartData

    const friends = await prisma.friend.findMany({
        where: {
            OR: [
                { userId: session.user.id, status: "accepted" },
                { friendId: session.user.id, status: "accepted" },
            ],
        },
        include: {
            user: {
                include: { musicChart: true },
            },
            friend: {
                include: { musicChart: true },
            },
        },
    })

    const friendsWithCharts = friends
        .map((friendship) => {
            const friend = friendship.userId === session.user.id ? friendship.friend : friendship.user
            return friend
        })
        .filter((friend) => friend.musicChart)

    const compatibilityScores = calculateFriendsCompatibility(session.user.id, chartData, friendsWithCharts)

    return (
        <div className="mx-auto px-4 py-8 space-y-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-4 text-glow-pink">Musical Compatibility</h1>
                    <p className="text-purple-200">Discover how your music taste aligns with your friends' cosmic charts.</p>
                </div>
                <div className="bg-gradient-to-br from-purple-900/40 to-fuchsia-900/40 backdrop-blur-md rounded-xl p-6 border border-purple-500/20 box-glow mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-glow">Your Friends' Musical Compatibility</h2>
                        <div className="flex items-center gap-2 text-purple-300">
                            <Users size={20} />
                            <span>{friendsWithCharts.length} friends with charts</span>
                        </div>
                    </div>
                    {compatibilityScores.length > 0 ? (
                        <div className="space-y-4">
                            {compatibilityScores.map(({ user, score, matchingSigns, matchingArtists, matchingElements }) => (
                                <CompatibilityCard key={user.id} user={user} score={score} matchingSigns={matchingSigns} matchingArtists={matchingArtists} matchingElements={matchingElements} />
                            ))}
                        </div>
                    ) : friendsWithCharts.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center box-glow-pink mb-4 mx-auto"><UserPlus size={32} className="text-white" /></div>
                            <h3 className="text-xl font-bold text-white mb-2">No Friends with Charts Yet</h3>
                            <p className="text-purple-300 mb-6">Add friends who have generated their music zodiac charts to see compatibility scores.</p>
                            <Link href={ROUTES.FRIENDS} className="neon-button">Find Friends</Link>
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-600 to-red-600 flex items-center justify-center box-glow-pink mb-4 mx-auto"><Users size={32} className="text-white" /></div>
                            <h3 className="text-xl font-bold text-white mb-2">Friends Need to Generate Charts</h3>
                            <p className="text-purple-300 mb-6">You have {friends.length} friends, but they haven't generated their music zodiac charts yet. Encourage them to connect their Last.fm accounts!</p>
                            <Link href={ROUTES.FRIENDS} className="neon-button">View Friends</Link>
                        </div>
                    )}
                </div>
                <div className="bg-gradient-to-br from-purple-900/40 to-fuchsia-900/40 backdrop-blur-md rounded-xl p-6 border border-purple-500/20">
                    <h2 className="text-xl font-bold mb-4 text-glow">Compatibility Guide</h2>
                    <CompatibilityGuide />
                </div>
            </div>
        </div>
    )
}

function calculateFriendsCompatibility(currentUserId: string, userChartData: MusicChartData, friends: any[]) {
    const compatibilityScores = friends
        .map((friend) => {
            const otherChartData = friend.musicChart?.chartData as unknown as MusicChartData
            if (!otherChartData) return null

            const compatibility = calculateCompatibility(userChartData, otherChartData)
            return { user: friend, ...compatibility }
        })
        .filter((score) => score !== null)
        .sort((a, b) => b!.score - a!.score)

    return compatibilityScores as Array<{
        user: any
        score: number
        matchingSigns: string[]
        matchingArtists: number
        matchingPlanets: number
        matchingElements: number
    }>
}
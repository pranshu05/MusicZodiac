import { authOptions } from "@/utils/auth"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { ROUTES } from "@/utils/constants"
import type { MusicChartData } from "@/types/spotify"
import { generateAndSaveChart } from "@/utils/generate-chart"
import Link from "next/link"
import { Users } from "lucide-react"
import { calculateCompatibility } from "@/utils/compatibility"
import { CompatibilityCard } from "@/components/compatibility/compatibility-card"
import { CompatibilityGuide } from "@/components/compatibility/compatibility-guide"

const TOP_MATCHES_COUNT = 5
const BATCH_SIZE = 100

export default async function CompatibilityPage() {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
        redirect(ROUTES.HOME)
    }

    let userChart = await prisma.musicChart.findUnique({
        where: { userId: session.user.id },
    })

    if (!userChart) {
        try {
            const userData = await prisma.user.findUnique({
                where: { id: session.user.id }
            })

            if (!userData) throw new Error("User not found")

            await generateAndSaveChart(userData)
            userChart = await prisma.musicChart.findUnique({
                where: { userId: session.user.id }
            })
        } catch (error) {
            console.error("Failed to generate chart:", error)
        }
    }

    if (!userChart) throw new Error("Failed to generate or retrieve user chart")

    const chartData = userChart.chartData as unknown as MusicChartData

    const compatibilityScores = await fetchTopCompatibleUsers(session.user.id, chartData, TOP_MATCHES_COUNT)

    return (
        <div className="mx-auto px-4 py-8 space-y-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-4 text-glow-pink">Musical Compatibility</h1>
                    <p className="text-purple-200">Find your musical soulmates based on your zodiac chart alignment.</p>
                </div>
                <div className="bg-gradient-to-br from-purple-900/40 to-fuchsia-900/40 backdrop-blur-md rounded-xl p-6 border border-purple-500/20 box-glow mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-glow">Your Top Matches</h2>
                        <Link href="/friends" className="flex items-center gap-2 text-pink-400 hover:text-pink-300 transition-colors">
                            <Users size={18} />
                            <span>Find Friends</span>
                        </Link>
                    </div>
                    {compatibilityScores.length > 0 ? (
                        <div className="space-y-4">
                            {compatibilityScores.map(({ user, score, matchingSigns, matchingArtists, matchingPlanets, matchingElements }) => (
                                <CompatibilityCard
                                    key={user.id}
                                    user={user}
                                    score={score}
                                    matchingSigns={matchingSigns}
                                    matchingArtists={matchingArtists}
                                    matchingPlanets={matchingPlanets}
                                    matchingElements={matchingElements}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-purple-300">No matches found yet. Connect with more friends!</p>
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

async function fetchTopCompatibleUsers(currentUserId: string, userChartData: MusicChartData, limit: number) {
    let topMatches: Array<{ user: any; score: number; matchingSigns: string[]; matchingArtists: number; matchingPlanets: number; matchingElements: number; }> = [];

    let processedCount = 0;
    let hasMore = true;

    while (hasMore) {
        const users = await prisma.user.findMany({
            where: {
                id: { not: currentUserId },
                musicChart: { isNot: null },
            },
            include: { musicChart: true },
            take: BATCH_SIZE,
            skip: processedCount,
            orderBy: { id: 'asc' },
        });

        if (users.length === 0) {
            hasMore = false;
            break;
        }

        processedCount += users.length;

        const batchScores = users
            .map(user => {
                const otherChartData = user.musicChart?.chartData as unknown as MusicChartData;
                if (!otherChartData) return null;

                const compatibility = calculateCompatibility(userChartData, otherChartData);
                return { user, ...compatibility };
            })
            .filter(score => score !== null) as typeof topMatches;

        topMatches = [...topMatches, ...batchScores]
            .sort((a, b) => b.score - a.score)
            .slice(0, limit);

        if (users.length < BATCH_SIZE) {
            hasMore = false;
        }
    }

    return topMatches;
}
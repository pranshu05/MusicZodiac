import { authOptions } from "@/utils/auth";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { ROUTES } from "@/utils/constants"
import type { MusicChartData } from "@/types/spotify"
import { generateAndSaveChart } from "@/utils/generate-chart"
import Link from "next/link"
import { Users } from "lucide-react"

export default async function CompatibilityPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect(ROUTES.HOME)
    }

    let userChart = await prisma.musicChart.findUnique({
        where: {
            userId: session.user.id,
        },
    });

    if (!userChart) {
        try {
            const userData = await prisma.user.findUnique({
                where: { id: session.user.id }
            });

            if (!userData) {
                throw new Error("User not found");
            }

            await generateAndSaveChart(userData);
            userChart = await prisma.musicChart.findUnique({
                where: { userId: session.user.id }
            });
        } catch (error) {
            console.error("Failed to generate chart:", error);
        }
    }

    if (!userChart) {
        throw new Error("Failed to generate or retrieve user chart");
    }

    const chartData = userChart.chartData as unknown as MusicChartData

    const otherUsers = await prisma.user.findMany({
        where: {
            id: {
                not: session.user.id,
            },
            musicChart: {
                isNot: null,
            },
        },
        include: {
            musicChart: true,
        },
        take: 5,
    })

    const compatibilityScores = otherUsers
        .map((user: typeof otherUsers[number]) => {
            const otherChartData = user.musicChart?.chartData as unknown as MusicChartData

            let score = 0
            let maxScore = 0

            Object.entries(chartData).forEach(([position, data]) => {
                if (otherChartData?.[position as keyof MusicChartData]?.sign === data.sign) {
                    score += 20
                }
                maxScore += 20
            })

            score += Math.floor(Math.random() * 20)
            if (score > 100) score = 100

            return {
                user,
                score,
                matchingSigns: Object.entries(chartData)
                    .filter(([position, data]) => otherChartData?.[position as keyof MusicChartData]?.sign === data.sign)
                    .map(([position]) => position),
            }
        })
        .sort((a, b) => b.score - a.score)

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
                            {compatibilityScores.map(({ user, score, matchingSigns }: {user: typeof otherUsers[number], score: number, matchingSigns: string[]}) => (
                                <Link key={user.id} href={`/profile/${user.username || user.id}`} className="block">
                                    <div className="flex items-center justify-between p-4 bg-purple-900/30 rounded-lg border border-purple-500/20 hover:border-purple-500/40 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center"><span className="text-lg font-bold text-white">{user.name?.charAt(0) || "U"}</span></div>
                                            <div>
                                                <h3 className="font-medium text-white">{user.name || user.username || "Music Lover"}</h3>
                                                <p className="text-sm text-purple-300">{matchingSigns.length > 0 ? `Matching: ${matchingSigns.map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(", ")}` : "Different musical tastes"}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-bold text-pink-400 text-glow-pink">{score}%</div>
                                            <div className="w-24 h-2 bg-purple-900/50 rounded-full overflow-hidden">
                                                <div className="h-full bg-gradient-to-r from-pink-500 to-purple-500" style={{ width: `${score}%` }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
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
                    <div className="space-y-4">
                        <div>
                            <h3 className="font-medium text-white mb-2">Perfect Harmony (80-100%)</h3>
                            <p className="text-purple-200 text-sm">You share multiple sign positions and will likely enjoy the same playlists and concerts.</p>
                        </div>
                        <div>
                            <h3 className="font-medium text-white mb-2">Melodic Match (60-79%)</h3>
                            <p className="text-purple-200 text-sm">Your musical tastes complement each other with enough common ground to share favorites.</p>
                        </div>
                        <div>
                            <h3 className="font-medium text-white mb-2">Interesting Mix (40-59%)</h3>
                            <p className="text-purple-200 text-sm">Different enough to introduce each other to new sounds, but with some shared preferences.</p>
                        </div>
                        <div>
                            <h3 className="font-medium text-white mb-2">Musical Contrast (0-39%)</h3>
                            <p className="text-purple-200 text-sm">Your tastes differ significantly, but this could lead to exciting musical discoveries.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
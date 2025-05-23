import { authOptions } from "@/utils/auth"
import { getServerSession } from "next-auth"
import { StarChart } from "@/components/chart/star-chart"
import { ChartDetails } from "@/components/chart/chart-details"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { ROUTES } from "@/utils/constants"
import type { MusicChartData } from "@/types/spotify"
import { ShareButtons } from "@/components/profile/share-buttons"
import { generateAndSaveChart } from "@/utils/generate-chart"

export default async function ChartPage() {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
        redirect(ROUTES.HOME)
    }

    try {
        let userChart = await prisma.musicChart.findUnique({
            where: {
                userId: session.user.id,
            },
        })

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
                console.error("Failed to generate chart:", error)
            }
        }

        if (!userChart) {
            throw new Error("Failed to generate or retrieve user chart")
        }

        const chartData = userChart.chartData as unknown as MusicChartData

        return (
            <div className="container mx-auto px-4 py-12 pb-24">
                <div className="max-w-5xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                        <div className="lg:sticky lg:top-24">
                            <div className="bg-gradient-to-br from-purple-900/40 to-fuchsia-900/40 backdrop-blur-md rounded-xl p-8 border border-purple-500/30 box-glow shadow-xl shadow-purple-900/20">
                                <StarChart chartData={chartData} className="max-w-md mx-auto" />
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
        )
    } catch (error) {
        console.error("Error fetching chart data:", error)
        redirect(ROUTES.HOME)
    }
}
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

    return (
        <div className="container mx-auto px-4 py-12 pb-24">
            <div className="max-w-5xl mx-auto">
                <DiscoveryEngine chartData={chartData} />
            </div>
        </div>
    )
}
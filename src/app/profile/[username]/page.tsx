import { authOptions } from "@/utils/auth";
import { getServerSession } from "next-auth";
import { StarChart } from "@/components/chart/star-chart"
import { ChartDetails } from "@/components/chart/chart-details"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import type { MusicChartData } from "@/types/spotify"
import { generateAndSaveChart } from "@/utils/generate-chart"
import { ProfileCard } from "@/components/profile/profile-card"
import { ShareButtons } from "@/components/profile/share-buttons"

interface ProfilePageProps {
    params: {
        username: string
    }
}

export default async function ProfilePage({ params }: ProfilePageProps) {
    const { username } = params
    const session = await getServerSession(authOptions);
    const currentUser = session?.user

    const user = await prisma.user.findFirst({
        where: { username },
        include: {
            musicChart: true,
        },
    })

    if (!user) {
        notFound()
    }

    let userChart = await prisma.musicChart.findUnique({
        where: {
            userId: user.id,
        },
    });

    if (!userChart) {
        try {
            const userData = await prisma.user.findUnique({
                where: { id: user.id }
            });

            if (!userData) {
                throw new Error("User not found");
            }

            await generateAndSaveChart(userData);
            userChart = await prisma.musicChart.findUnique({
                where: { userId: user.id }
            });
        } catch (error) {
            console.error("Failed to generate chart:", error);
        }
    }

    if (!userChart) {
        throw new Error("Failed to generate or retrieve user chart");
    }

    const chartData = userChart.chartData as unknown as MusicChartData
    const isOwnProfile = currentUser?.id === user.id

    return (
        <div className="mx-auto px-4 py-8 space-y-8">
            <div className="max-w-7xl mx-auto">
                <ProfileCard user={user} isOwnProfile={isOwnProfile} />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mt-8">
                    <div className="lg:sticky lg:top-24">
                        <div className="bg-gradient-to-br from-purple-900/40 to-fuchsia-900/40 backdrop-blur-md rounded-xl p-6 border border-purple-500/20 box-glow">
                            <StarChart chartData={chartData} className="max-w-md mx-auto" />
                            <div className="mt-6 text-center">
                                <h2 className="text-xl font-bold text-glow-pink mb-2">Share This Chart</h2>
                                <ShareButtons username={user.username || user.id} />
                            </div>
                        </div>
                    </div>
                    <ChartDetails chartData={chartData} username={user.name || undefined} />
                </div>
            </div>
        </div>
    )
}
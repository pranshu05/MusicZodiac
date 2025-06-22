import { authOptions } from "@/utils/auth";
import { getServerSession } from "next-auth";
import { StarChart } from "@/components/chart/star-chart"
import { LastfmLogin } from "@/components/auth/lastfm-login"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { ROUTES } from "@/utils/constants"
import { MonthlyVibe } from "@/components/home/monthly-vibe"
import { HeroSection } from "@/components/home/hero-section"
import { FeatureShowcase } from "@/components/home/feature-showcase"

export default async function Home() {
    const session = await getServerSession(authOptions);
    const user = session?.user;

    let userChart = null
    if (user?.id) {
        userChart = await prisma.musicChart.findUnique({
            where: {
                userId: user.id,
            },
        })
    }

    return (
        <div className="h-full mx-auto px-4 py-8 space-y-8">
            {!user ? (
                <>
                    <HeroSection />
                    <FeatureShowcase />
                </>
            ) : (
                <div className="max-w-7xl mx-auto">
                    {userChart ? (
                        <>
                            <div className="mb-12"><MonthlyVibe chartData={userChart.chartData as any} /></div>
                            <div className="mb-12">
                                <h2 className="text-2xl font-bold mb-6 text-glow">Your Music Zodiac</h2>
                                <div className="bg-gradient-to-br from-purple-900/40 to-fuchsia-900/40 backdrop-blur-md rounded-xl p-6 border border-purple-500/20 box-glow">
                                    <StarChart chartData={userChart.chartData as any} className="max-w-md mx-auto mb-8" />
                                    <div className="text-center"><Link href={ROUTES.CHART} className="neon-button">View Full Chart</Link></div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-12">
                            <h2 className="text-2xl font-bold mb-4 text-glow">Generate Your Music Zodiac</h2>
                            <p className="text-purple-200 mb-8">Connect with Lastfm to analyze your listening habits and discover your unique music zodiac chart.</p>
                            <LastfmLogin />
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
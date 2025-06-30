import { authOptions } from "@/utils/auth"
import { getServerSession } from "next-auth"
import { StarChart } from "@/components/chart/star-chart"
import { ChartDetails } from "@/components/chart/chart-details"
import { InsufficientDataError as InsufficientDataErrorComponent } from "@/components/chart/insufficient-data-error"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import type { MusicChartData } from "@/types/lastfm"
import { generateAndSaveChart } from "@/utils/generate-chart"
import { ProfileCard } from "@/components/profile/profile-card"
import { ShareButtons } from "@/components/profile/share-buttons"
import { InsufficientDataError } from "@/lib/lastfm"
import type { Metadata } from "next"

interface ProfilePageProps {
    params: {
        username: string
    }
}

export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
    const { username } = params

    const user = await prisma.user.findFirst({
        where: { username },
        select: { name: true, username: true, image: true },
    })

    if (!user) {
        return {
            title: "User Not Found | Music Zodiac",
            description: "The requested user profile could not be found.",
        }
    }

    const displayName = user.name || user.username || "Music Lover"

    return {
        title: `${displayName}'s Music Chart | Music Zodiac`,
        description: `Explore ${displayName}'s cosmic musical identity and zodiac chart. Discover their musical personality through astrological analysis of their Last.fm data.`,
        openGraph: {
            title: `${displayName}'s Music Chart | Music Zodiac`,
            description: `Explore ${displayName}'s cosmic musical identity and zodiac chart.`,
            images: [
                {
                    url: user.image || "/musiczodiac.png",
                    width: 400,
                    height: 400,
                    alt: `${displayName}'s Music Zodiac Chart`,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: `${displayName}'s Music Chart | Music Zodiac`,
            description: `Explore ${displayName}'s cosmic musical identity.`,
            images: [user.image || "/musiczodiac.png"],
        },
        alternates: {
            canonical: `/profile/${username}`,
        },
    }
}

export default async function ProfilePage({ params }: ProfilePageProps) {
    const { username } = params
    const session = await getServerSession(authOptions)
    const currentUser = session?.user

    const user = await prisma.user.findFirst({
        where: { username },
        include: { musicChart: true },
    })

    if (!user) {
        notFound()
    }

    let userChart = await prisma.musicChart.findUnique({
        where: {
            userId: user.id,
        },
    })

    let insufficientDataDetails = null

    if (!userChart) {
        try {
            const userData = await prisma.user.findUnique({
                where: { id: user.id },
            })

            if (!userData) {
                throw new Error("User not found")
            }

            await generateAndSaveChart(userData)
            userChart = await prisma.musicChart.findUnique({
                where: { userId: user.id },
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
    const isOwnProfile = currentUser?.id === user.id

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "ProfilePage",
        mainEntity: {
            "@type": "Person",
            name: user.name || user.username,
            identifier: user.username,
            image: user.image,
            url: `https://musiczodiac.com/profile/${user.username}`,
            sameAs: `https://last.fm/user/${user.username}`,
            description: `${user.name || user.username}'s music zodiac chart and cosmic musical identity`,
        },
        about: {
            "@type": "CreativeWork",
            name: "Music Zodiac Chart",
            description: "A personalized astrological analysis of musical taste",
        },
    }

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <div className="container mx-auto px-4 py-12 pb-24">
                <div className="max-w-7xl mx-auto">
                    <ProfileCard user={user} isOwnProfile={isOwnProfile} />
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mt-8">
                        <div className="lg:sticky lg:top-24">
                            <div className="bg-gradient-to-br from-purple-900/40 to-fuchsia-900/40 backdrop-blur-md rounded-xl p-8 border border-purple-500/30 box-glow shadow-xl shadow-purple-900/20">
                                <StarChart chartData={chartData} className="max-w-xl mx-auto" />
                                {isOwnProfile && (
                                    <div className="mt-6 text-center">
                                        <h2 className="text-xl font-bold text-glow-pink mb-2">Share This Chart</h2>
                                        <ShareButtons username={user.username || user.id} />
                                    </div>
                                )}
                            </div>
                        </div>
                        <ChartDetails chartData={chartData} username={user.name || undefined} />
                    </div>
                </div>
            </div>
        </>
    )
}
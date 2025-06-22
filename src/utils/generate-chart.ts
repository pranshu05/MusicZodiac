import { prisma } from "@/lib/prisma"
import { getLastFmData } from "@/lib/lastfm"
import type { User } from "@prisma/client"

type OptimizedArtist = {
    id: string
    name: string
    image?: string
}

type OptimizedChartData = {
    [key: string]: {
        sign: string
        artists: OptimizedArtist[]
    }
}

function optimizeChartData(fullChartData: any): OptimizedChartData {
    try {
        if (!fullChartData) {
            return {}
        }

        const optimizedData: OptimizedChartData = {}

        Object.keys(fullChartData).forEach((key) => {
            const signData = fullChartData[key]

            if (signData && signData.artists && Array.isArray(signData.artists)) {
                optimizedData[key] = {
                    sign: signData.sign || "",
                    artists: signData.artists.map((artist: any) => {
                        const optimizedArtist: OptimizedArtist = {
                            id: artist.id || artist.name || "",
                            name: artist.name || "",
                        }

                        if (artist.image) {
                            optimizedArtist.image = artist.image
                        }

                        return optimizedArtist
                    }),
                }
            }
        })

        return optimizedData
    } catch {
        return {}
    }
}

export async function generateAndSaveChart(user: User) {
    try {
        if (!user.id) {
            throw new Error("User ID is required")
        }

        const account = await prisma.account.findFirst({
            where: {
                userId: user.id,
                provider: "lastfm",
            },
        })

        if (!account || !account.access_token) {
            throw new Error("Last.fm account or session key not found")
        }

        const username = user.username || user.id

        const fullChartData = await getLastFmData( username)

        if (!fullChartData) {
            throw new Error("Failed to generate chart data")
        }

        const optimizedChartData = optimizeChartData(fullChartData)

        const existingChart = await prisma.musicChart.findUnique({
            where: {
                userId: user.id,
            },
        })

        let result

        if (existingChart) {
            result = await prisma.musicChart.update({
                where: {
                    userId: user.id,
                },
                data: {
                    chartData: optimizedChartData as any,
                    updatedAt: new Date(),
                },
            })
        } else {
            result = await prisma.musicChart.create({
                data: {
                    userId: user.id,
                    chartData: optimizedChartData as any,
                    generatedAt: new Date(),
                },
            })
        }

        return result
    } catch (error) {
        throw error
    }
}
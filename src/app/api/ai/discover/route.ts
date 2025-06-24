import { NextResponse, type NextRequest } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/utils/auth"
import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"
import { prisma } from "@/lib/prisma"
import type { MusicChartData } from "@/types/lastfm"

const CACHE_DURATION_HOURS = 24

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { chartData, discoveryType = "artists", forceRegenerate = false } = await req.json()

        if (!chartData) {
            return NextResponse.json({ error: "Chart data is required" }, { status: 400 })
        }

        if (!["artists", "genres"].includes(discoveryType)) {
            return NextResponse.json({ error: "Invalid discovery type" }, { status: 400 })
        }

        const existingDiscovery = await prisma.aIForecast.findUnique({
            where: {
                userId_type_subType: {
                    userId: session.user.id,
                    type: "discovery",
                    subType: discoveryType,
                },
            },
        })

        if (existingDiscovery && !forceRegenerate) {
            const hoursSinceGenerated = (Date.now() - existingDiscovery.generatedAt.getTime()) / (1000 * 60 * 60)

            if (hoursSinceGenerated < CACHE_DURATION_HOURS) {
                return NextResponse.json({
                    ...existingDiscovery.data,
                    cached: true,
                    generatedAt: existingDiscovery.generatedAt,
                    canRegenerate: false,
                    nextRegenerateTime: new Date(existingDiscovery.generatedAt.getTime() + CACHE_DURATION_HOURS * 60 * 60 * 1000),
                })
            }
        }

        const chartAnalysis = Object.entries(chartData as MusicChartData)
            .map(([position, data]) => {
                const artists = data.artists
                    .slice(0, 2)
                    .map((a) => a.name)
                    .join(", ")
                return `${position.charAt(0).toUpperCase() + position.slice(1)}: ${data.sign} (Artists: ${artists})`
            })
            .join("\n")

        let prompt = ""

        if (discoveryType === "artists") {
            prompt = `You are a music discovery expert. Based on this user's Music Zodiac chart, recommend 5 specific artists they should discover.

                    MUSIC CHART:
                    ${chartAnalysis}

                    Recommend artists that:
                    - Complement their existing taste but introduce new elements
                    - Connect to their astrological chart positions
                    - Are real, well-known artists (not fictional)
                    - Span different eras and styles within their preferences

                    Respond ONLY with valid JSON in this exact format:

                    [
                    {
                        "name": "Artist Name",
                        "reason": "Brief explanation of why this artist fits their taste",
                        "chartConnection": "How this connects to their specific chart position"
                    },
                    {
                        "name": "Artist Name",
                        "reason": "Brief explanation of why this artist fits their taste", 
                        "chartConnection": "How this connects to their specific chart position"
                    },
                    {
                        "name": "Artist Name",
                        "reason": "Brief explanation of why this artist fits their taste",
                        "chartConnection": "How this connects to their specific chart position"
                    },
                    {
                        "name": "Artist Name",
                        "reason": "Brief explanation of why this artist fits their taste",
                        "chartConnection": "How this connects to their specific chart position"
                    },
                    {
                        "name": "Artist Name",
                        "reason": "Brief explanation of why this artist fits their taste",
                        "chartConnection": "How this connects to their specific chart position"
                    }
                    ]

                    Respond with ONLY the JSON array, no other text.`
        } else {
            prompt = `You are a music genre expert. Based on this user's Music Zodiac chart, suggest 4 new genres or subgenres for exploration.

                    MUSIC CHART:
                    ${chartAnalysis}

                    Suggest genres that:
                    - Complement their existing planetary positions
                    - Fill gaps in their musical spectrum
                    - Are real music genres (not fictional)
                    - Would naturally appeal based on their chart

                    Respond ONLY with valid JSON in this exact format:

                    [
                    {
                        "genre": "Genre Name",
                        "description": "Brief description of this genre and its characteristics",
                        "whyItFits": "Explanation of how this aligns with their astrological profile"
                    },
                    {
                        "genre": "Genre Name", 
                        "description": "Brief description of this genre and its characteristics",
                        "whyItFits": "Explanation of how this aligns with their astrological profile"
                    },
                    {
                        "genre": "Genre Name",
                        "description": "Brief description of this genre and its characteristics", 
                        "whyItFits": "Explanation of how this aligns with their astrological profile"
                    },
                    {
                        "genre": "Genre Name",
                        "description": "Brief description of this genre and its characteristics",
                        "whyItFits": "Explanation of how this aligns with their astrological profile"
                    }
                    ]

                    Respond with ONLY the JSON array, no other text.`
        }

        const { text } = await generateText({
            model: groq("meta-llama/llama-4-scout-17b-16e-instruct"),
            prompt,
            temperature: 0.8,
            maxTokens: 1000,
        })

        let aiResponse
        try {
            const cleanedText = text
                .trim()
                .replace(/```json\n?|\n?```/g, "")
                .replace(/^[^[{]*/, "")
                .replace(/[^\]}]*$/, "")
            const parsedResponse = JSON.parse(cleanedText)

            if (discoveryType === "artists") {
                if (!Array.isArray(parsedResponse) || parsedResponse.length !== 5) {
                    throw new Error("Invalid artists array format")
                }
                aiResponse = { artists: parsedResponse }
            } else {
                if (!Array.isArray(parsedResponse) || parsedResponse.length !== 4) {
                    throw new Error("Invalid genres array format")
                }
                aiResponse = { genres: parsedResponse }
            }
        } catch {
            if (discoveryType === "artists") {
                aiResponse = {
                    artists: [
                        {
                            name: "Tame Impala",
                            reason: "Psychedelic pop that bridges electronic and rock elements",
                            chartConnection: "Connects to your Alternative and Electronic positions",
                        },
                        {
                            name: "FKA twigs",
                            reason: "Experimental R&B with ethereal production",
                            chartConnection: "Aligns with your R&B and Electronic influences",
                        },
                        {
                            name: "Khruangbin",
                            reason: "Global instrumental fusion with hypnotic grooves",
                            chartConnection: "Matches your World/Traditional and Jazz elements",
                        },
                        {
                            name: "Blood Orange",
                            reason: "Modern R&B with indie and electronic influences",
                            chartConnection: "Bridges your R&B and Alternative positions",
                        },
                        {
                            name: "Thundercat",
                            reason: "Jazz fusion with hip-hop and electronic elements",
                            chartConnection: "Connects your Jazz and Hip Hop chart positions",
                        },
                    ],
                }
            } else {
                aiResponse = {
                    genres: [
                        {
                            genre: "Neo-Soul",
                            description: "Modern evolution of soul music with contemporary production",
                            whyItFits: "Bridges your R&B and Soul positions with modern appeal",
                        },
                        {
                            genre: "Synthwave",
                            description: "Retro-futuristic electronic music inspired by 80s aesthetics",
                            whyItFits: "Connects your Electronic position with nostalgic elements",
                        },
                        {
                            genre: "Math Rock",
                            description: "Complex instrumental rock with intricate rhythms",
                            whyItFits: "Appeals to your Rock position while adding intellectual complexity",
                        },
                        {
                            genre: "Afrobeat",
                            description: "West African music style combining jazz, funk, and traditional rhythms",
                            whyItFits: "Expands your World/Traditional position with rhythmic complexity",
                        },
                    ],
                }
            }
        }

        await prisma.AIForecast.upsert({
            where: {
                userId_type_subType: {
                    userId: session.user.id,
                    type: "discovery",
                    subType: discoveryType,
                },
            },
            update: {
                data: aiResponse,
                generatedAt: new Date(),
            },
            create: {
                userId: session.user.id,
                type: "discovery",
                subType: discoveryType,
                data: aiResponse,
            },
        })

        return NextResponse.json({
            ...aiResponse,
            cached: false,
            generatedAt: new Date(),
            canRegenerate: false,
            nextRegenerateTime: new Date(Date.now() + CACHE_DURATION_HOURS * 60 * 60 * 1000),
        })
    } catch {
        return NextResponse.json({ error: "Failed to generate discovery insights" }, { status: 500 })
    }
}
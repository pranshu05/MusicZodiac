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

        const { chartData, forceRegenerate = false } = await req.json()

        if (!chartData) {
            return NextResponse.json({ error: "Chart data is required" }, { status: 400 })
        }

        const existingForecast = await prisma.aIForecast.findUnique({
            where: {
                userId_type_subType: {
                    userId: session.user.id,
                    type: "monthly",
                    subType: "monthly",
                },
            },
        })

        if (existingForecast && !forceRegenerate) {
            const hoursSinceGenerated = (Date.now() - existingForecast.generatedAt.getTime()) / (1000 * 60 * 60)

            if (hoursSinceGenerated < CACHE_DURATION_HOURS) {
                return NextResponse.json({
                    ...existingForecast.data,
                    cached: true,
                    generatedAt: existingForecast.generatedAt,
                    canRegenerate: false,
                    nextRegenerateTime: new Date(existingForecast.generatedAt.getTime() + CACHE_DURATION_HOURS * 60 * 60 * 1000),
                })
            }
        }

        const currentDate = new Date()
        const currentMonth = currentDate.toLocaleString("default", { month: "long" })
        const currentYear = currentDate.getFullYear()

        const chartSummary = Object.entries(chartData as MusicChartData)
            .map(([position, data]) => {
                const artists = data.artists
                    .slice(0, 2)
                    .map((a) => a.name)
                    .join(", ")
                return `${position.charAt(0).toUpperCase() + position.slice(1)}: ${data.sign} (Top Artists: ${artists})`
            })
            .join("\n")

        const prompt = `You are an expert music astrologer. Analyze this user's Music Zodiac chart for ${currentMonth} ${currentYear}.

                        MUSIC CHART DATA:
                        ${chartSummary}

                        Create a personalized monthly music forecast. Respond ONLY with valid JSON in this exact format:

                        {
                        "interpretation": "2-3 sentences about their current musical energy based on their chart positions",
                        "recommendations": [
                            "First specific recommendation that references their chart",
                            "Second specific recommendation that references their chart", 
                            "Third specific recommendation that references their chart"
                        ],
                        "prediction": "One sentence prediction about their musical direction this month"
                        }

                        Guidelines:
                        - Reference specific chart positions (e.g., "Your Mars in Rock suggests...")
                        - Make recommendations that expand their existing taste
                        - Be mystical but practical
                        - Keep recommendations actionable and specific
                        - Focus on musical discovery and growth

                        Respond with ONLY the JSON object, no other text.`

        const { text } = await generateText({
            model: groq("meta-llama/llama-4-scout-17b-16e-instruct"),
            prompt,
            temperature: 0.7,
            maxTokens: 800,
        })

        let aiResponse
        try {
            const cleanedText = text
                .trim()
                .replace(/```json\n?|\n?```/g, "")
                .replace(/^[^{]*/, "")
                .replace(/[^}]*$/, "")
            aiResponse = JSON.parse(cleanedText)

            if (!aiResponse.interpretation || !aiResponse.recommendations || !aiResponse.prediction) {
                throw new Error("Missing required fields")
            }

            if (!Array.isArray(aiResponse.recommendations) || aiResponse.recommendations.length !== 3) {
                throw new Error("Invalid recommendations format")
            }
        } catch {
            aiResponse = {
                interpretation: `Your ${chartData.sun.sign} Sun and ${chartData.moon?.sign || "diverse"} Moon create a unique musical identity that blends multiple influences this ${currentMonth}.`,
                recommendations: [
                    `Explore deeper into your ${chartData.venus?.sign || "Pop"} Venus position by discovering B-sides and rare tracks from your favorite artists`,
                    `Your ${chartData.mars?.sign || "Rock"} Mars suggests trying high-energy workout playlists that match your musical drive`,
                    `Connect with your ${chartData.jupiter?.sign || "World"} Jupiter by exploring international artists in your preferred genres`,
                ],
                prediction: `This ${currentMonth}, your musical journey will be influenced by the harmony between your core ${chartData.sun.sign} identity and your emotional connections.`,
            }
        }

        await prisma.aIForecast.upsert({
            where: {
                userId_type_subType: {
                    userId: session.user.id,
                    type: "monthly",
                    subType: "monthly",
                },
            },
            update: {
                data: aiResponse,
                generatedAt: new Date(),
            },
            create: {
                userId: session.user.id,
                type: "monthly",
                subType: "monthly",
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
        return NextResponse.json({ error: "Failed to generate forecast" }, { status: 500 })
    }
}
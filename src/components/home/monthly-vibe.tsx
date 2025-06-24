"use client"
import { useState, useEffect } from "react"
import type { MusicChartData } from "@/types/lastfm"
import Link from "next/link"
import { Sun, Sparkles, Clock, Database, Users } from "lucide-react"

interface MonthlyVibeProps {
    chartData: MusicChartData
}

interface AIForecast {
    interpretation: string
    recommendations: string[]
    prediction: string
    cached?: boolean
    generatedAt?: string
    canRegenerate?: boolean
    nextRegenerateTime?: string
}

export function MonthlyVibe({ chartData }: MonthlyVibeProps) {
    const [activeTab, setActiveTab] = useState<"monthly" | "compatibility">("monthly")
    const [aiForecast, setAiForecast] = useState<AIForecast | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const generateAIForecast = async () => {
        setIsLoading(true)
        setError(null)

        try {
            const response = await fetch("/api/ai/monthly-forecast", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ chartData }),
            })

            if (!response.ok) {
                throw new Error("Failed to generate forecast")
            }

            const forecast = await response.json()
            setAiForecast(forecast)
        } catch {
            setError("Unable to generate personalized forecast")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (activeTab === "monthly" && !aiForecast && !isLoading) {
            generateAIForecast()
        }
    }, [activeTab, chartData])

    const getFallbackForecast = (): AIForecast => {
        const dominantSigns = Object.values(chartData)
            .map((data) => data.sign)
            .slice(0, 3)

        return {
            interpretation: `Your ${chartData.sun.sign} Sun and ${chartData.moon?.sign || "diverse"} Moon create a unique musical identity that blends ${dominantSigns.join(", ").toLowerCase()} influences.`,
            recommendations: [
                `Explore the deeper catalog of artists in your ${chartData.venus?.sign || "Pop"} Venus position`,
                `Try collaborative playlists with friends who share your ${chartData.mars?.sign || "Rock"} Mars energy`,
                `Discover instrumental versions of your favorite ${chartData.sun.sign.toLowerCase()} tracks for focus sessions`,
            ],
            prediction: `This month, your musical journey will be influenced by the interplay between your core ${chartData.sun.sign} identity and your emotional ${chartData.moon?.sign || "Alternative"} connections.`,
        }
    }

    const displayForecast = aiForecast || getFallbackForecast()

    const formatTimeUntilRegenerate = (nextTime: string) => {
        const now = new Date()
        const next = new Date(nextTime)
        const hoursLeft = Math.ceil((next.getTime() - now.getTime()) / (1000 * 60 * 60))

        if (hoursLeft <= 0) return "Available now"
        if (hoursLeft === 1) return "1 hour"
        return `${hoursLeft} hours`
    }

    return (
        <div className="bg-gradient-to-br from-purple-900/40 to-fuchsia-900/40 backdrop-blur-md rounded-2xl border border-purple-500/20 overflow-hidden box-glow">
            <div className="flex border-b border-purple-500/20">
                <button className={`flex-1 py-4 px-4 sm:px-6 text-center font-medium transition-all duration-300 text-sm sm:text-base ${activeTab === "monthly" ? "bg-gradient-to-r from-pink-600/30 to-purple-600/30 text-white text-glow-pink" : "text-purple-300 hover:text-white hover:bg-purple-800/20"}`} onClick={() => setActiveTab("monthly")}>Monthly Vibe</button>
                <button className={`flex-1 py-4 px-4 sm:px-6 text-center font-medium transition-all duration-300 text-sm sm:text-base ${activeTab === "compatibility" ? "bg-gradient-to-r from-pink-600/30 to-purple-600/30 text-white text-glow-pink" : "text-purple-300 hover:text-white hover:bg-purple-800/20"}`} onClick={() => setActiveTab("compatibility")}>Compatibility</button>
            </div>
            <div className="p-4 sm:p-6">
                {activeTab === "monthly" ? (
                    <div className="space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <h2 className="text-xl sm:text-2xl font-bold text-glow-pink">AI-Powered Monthly Forecast</h2>
                            {aiForecast?.cached && (<div className="flex items-center gap-2 text-xs text-purple-400 bg-purple-900/30 px-3 py-1 rounded-full"><Database size={12} /><span>Cached forecast</span></div>)}
                        </div>
                        {isLoading && (
                            <div className="text-center py-8 sm:py-12">
                                <div className="w-8 h-8 border-2 border-pink-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                <p className="text-purple-300 text-sm sm:text-base">AI is analyzing your musical cosmos...</p>
                            </div>
                        )}
                        {error && (
                            <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-4">
                                <p className="text-red-300 text-sm">{error}</p>
                            </div>
                        )}
                        {!isLoading && (
                            <div className="space-y-4 sm:space-y-6">
                                <div className="bg-gradient-to-r from-purple-800/30 to-fuchsia-800/30 rounded-xl p-4 border border-purple-500/20">
                                    <div className="flex items-center mb-3">
                                        <Sparkles size={16} className="text-pink-300 mr-2 flex-shrink-0" />
                                        <h4 className="font-bold text-pink-200 text-sm sm:text-base">Cosmic Musical Interpretation</h4>
                                    </div>
                                    <p className="text-purple-200 text-sm leading-relaxed">{displayForecast.interpretation}</p>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-lg sm:text-xl font-bold text-glow">AI-Curated Recommendations</h3>
                                    <div className="space-y-3">
                                        {displayForecast.recommendations.map((rec, index) => (
                                            <div key={index} className="flex items-start gap-3 p-3 bg-purple-900/20 rounded-xl border border-purple-500/10">
                                                <span className="w-6 h-6 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex-shrink-0 flex items-center justify-center text-xs font-bold">{index + 1}</span>
                                                <span className="text-purple-100 text-sm leading-relaxed">{rec}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="bg-gradient-to-r from-purple-800/30 to-fuchsia-800/30 rounded-xl p-4 border border-purple-500/20">
                                    <div className="flex items-center mb-2"><Sun size={16} className="text-yellow-300 mr-2 flex-shrink-0" /><h4 className="font-bold text-yellow-200 text-sm sm:text-base">Monthly Prediction</h4></div>
                                    <p className="text-purple-200 text-sm leading-relaxed">{displayForecast.prediction}</p>
                                </div>
                                {aiForecast && (
                                    <div className="text-center space-y-2 pt-2">
                                        <p className="text-xs text-purple-400">✨ Powered by AI • Generated based on your unique musical chart</p>
                                        {aiForecast.nextRegenerateTime && (<div className="flex items-center justify-center gap-2 text-xs text-purple-500"><Clock size={12} /><span>Next update available in {formatTimeUntilRegenerate(aiForecast.nextRegenerateTime)}</span></div>)}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="space-y-6">
                        <h2 className="text-xl sm:text-2xl font-bold text-glow-pink">Friends Musical Compatibility</h2>
                        <p className="text-purple-200 text-sm sm:text-base leading-relaxed">Discover how your music chart aligns with your friends' cosmic musical identities!</p>
                        <div className="flex justify-center py-4"><Link href="/compatibility" className="neon-button">Check Friends Compatibility</Link></div>
                        <div className="bg-gradient-to-r from-purple-800/30 to-fuchsia-800/30 rounded-xl p-4 border border-purple-500/20">
                            <div className="flex items-center mb-2"><Users size={16} className="text-blue-300 mr-2 flex-shrink-0" /><h4 className="font-bold text-blue-200 text-sm sm:text-base">Compatibility Insights</h4></div>
                            <p className="text-purple-200 text-sm leading-relaxed">Your {chartData.sun.sign} Sun harmonizes well with {chartData.venus?.sign || "Pop"} and{" "} {chartData.jupiter?.sign || "World"} listeners, while your {chartData.moon?.sign || "Alternative"} Moon creates deep connections with emotionally-driven music lovers.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
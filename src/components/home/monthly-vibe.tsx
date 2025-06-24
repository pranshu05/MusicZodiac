"use client"
import { useState, useEffect } from "react"
import type { MusicChartData } from "@/types/lastfm"
import Link from "next/link"
import { Sun, Moon, Sparkles, Clock, Database } from "lucide-react"

interface MonthlyVibeProps {
    chartData: MusicChartData
}

interface aIForecast {
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
    const [aiForecast, setAiForecast] = useState<aIForecast | null>(null)
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

    const getFallbackForecast = (): aIForecast => {
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
        <div className="bg-gradient-to-br from-purple-900/40 to-fuchsia-900/40 backdrop-blur-md rounded-xl border border-purple-500/20 overflow-hidden box-glow">
            <div className="flex border-b border-purple-500/20">
                <button className={`flex-1 py-4 px-6 text-center font-medium transition-all duration-300 ${activeTab === "monthly" ? "bg-gradient-to-r from-pink-600/30 to-purple-600/30 text-white text-glow-pink" : "text-purple-300 hover:text-white"}`} onClick={() => setActiveTab("monthly")}>Monthly Vibe</button>
                <button className={`flex-1 py-4 px-6 text-center font-medium transition-all duration-300 ${activeTab === "compatibility" ? "bg-gradient-to-r from-pink-600/30 to-purple-600/30 text-white text-glow-pink" : "text-purple-300 hover:text-white"}`} onClick={() => setActiveTab("compatibility")}>Compatibility</button>
            </div>
            <div className="p-6">
                {activeTab === "monthly" ? (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-glow-pink">Your AI-Powered Monthly Music Forecast</h2>
                            {aiForecast?.cached && (<div className="flex items-center gap-2 text-xs text-purple-400"><Database size={14} /><span>Cached forecast</span></div>)}
                        </div>
                        {isLoading && (
                            <div className="text-center py-8">
                                <div className="w-8 h-8 border-2 border-pink-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                <p className="text-purple-300">AI is analyzing your musical cosmos...</p>
                            </div>
                        )}
                        {error && (
                            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                                <p className="text-red-300">{error}</p>
                            </div>
                        )}
                        {!isLoading && (
                            <div className="space-y-6">
                                <div className="bg-gradient-to-r from-purple-800/30 to-fuchsia-800/30 rounded-lg p-4 border border-purple-500/20">
                                    <div className="flex items-center mb-3"><Sparkles size={18} className="text-pink-300 mr-2" /><h4 className="font-bold text-pink-200">Cosmic Musical Interpretation</h4></div>
                                    <p className="text-purple-200 text-sm leading-relaxed">{displayForecast.interpretation}</p>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold text-glow">AI-Curated Recommendations</h3>
                                    <ul className="space-y-3">
                                        {displayForecast.recommendations.map((rec, index) => (
                                            <li key={index} className="flex items-start">
                                                <span className="w-6 h-6 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex-shrink-0 mr-3 flex items-center justify-center text-xs font-bold">{index + 1}</span>
                                                <span className="text-purple-100">{rec}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="bg-gradient-to-r from-purple-800/30 to-fuchsia-800/30 rounded-lg p-4 border border-purple-500/20">
                                    <div className="flex items-center mb-2"><Sun size={18} className="text-yellow-300 mr-2" /><h4 className="font-bold text-yellow-200">Monthly Prediction</h4></div>
                                    <p className="text-purple-200 text-sm">{displayForecast.prediction}</p>
                                </div>
                                {aiForecast && (
                                    <div className="text-center space-y-2">
                                        <p className="text-xs text-purple-400">✨ Powered by AI • Generated based on your unique musical chart</p>
                                        {aiForecast.nextRegenerateTime && (<div className="flex items-center justify-center gap-2 text-xs text-purple-500"><Clock size={12} /><span>Next update available in {formatTimeUntilRegenerate(aiForecast.nextRegenerateTime)}</span></div>)}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-glow-pink">Friends Musical Compatibility</h2>
                        <p className="text-purple-200">Discover how your music chart aligns with your friends' cosmic musical identities!</p>
                        <div className="flex justify-center py-4"><Link href="/compatibility" className="neon-button">Check Friends Compatibility</Link></div>
                        <div className="bg-gradient-to-r from-purple-800/30 to-fuchsia-800/30 rounded-lg p-4 border border-purple-500/20">
                            <div className="flex items-center mb-2"><Moon size={18} className="text-blue-300 mr-2" /><h4 className="font-bold text-blue-200">Compatibility Insights</h4></div>
                            <p className="text-purple-200 text-sm">Your {chartData.sun.sign} Sun harmonizes well with {chartData.venus?.sign || "Pop"} and{" "} {chartData.jupiter?.sign || "World"} listeners, while your {chartData.moon?.sign || "Alternative"} Moon creates deep connections with emotionally-driven music lovers.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
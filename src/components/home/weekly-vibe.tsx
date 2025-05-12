"use client"
import { useState } from "react"
import type { MusicChartData } from "@/types/spotify"
import { MUSIC_SIGNS } from "@/utils/constants"
import Link from "next/link"
import { Sun, Moon, ArrowRight } from "lucide-react"

interface WeeklyVibeProps {
    chartData: MusicChartData
}

export function WeeklyVibe({ chartData }: WeeklyVibeProps) {
    const [activeTab, setActiveTab] = useState<"weekly" | "compatibility">("weekly")

    const getRandomRecommendations = () => {
        const recommendations = [
            "Try some pop-punk classics to match your energy",
            "Your emotional side needs some acoustic ballads",
            "Perfect day for discovering a new female vocalist",
            "Explore some instrumental tracks to boost focus",
            "Add some nostalgic tracks from your teenage years",
            "Time to revisit albums that defined your taste",
            "Your chart suggests you'd enjoy some jazz fusion",
            "Connect with the rhythmic elements of afrobeat",
            "Your Venus sign aligns with electronic ambient music this week",
        ]

        return [...recommendations].sort(() => Math.random() - 0.5).slice(0, 3)
    }

    const recommendations = getRandomRecommendations()

    const getRandomForecast = () => {
        const forecasts = [
            `Your ${chartData.venus?.sign} Venus aligns with Neptune, bringing nostalgic vibes. Make a playlist of songs from your past that defined important moments.`,
            `With ${chartData.mars?.sign} Mars transiting your ${chartData.sun.sign} sun, it's a great time to explore high-energy music with complex rhythms.`,
            `The ${chartData.moon?.sign} moon is in harmony with your chart this week, making it perfect for emotional exploration through music.`,
            `Your ${chartData.rising?.sign} rising sign is highlighted this weekend, bringing new musical discoveries that will surprise you.`,
        ]

        return forecasts[Math.floor(Math.random() * forecasts.length)]
    }

    const forecast = getRandomForecast()

    return (
        <div className="bg-gradient-to-br from-purple-900/40 to-fuchsia-900/40 backdrop-blur-md rounded-xl border border-purple-500/20 overflow-hidden box-glow">
            <div className="flex border-b border-purple-500/20">
                <button className={`flex-1 py-4 px-6 text-center font-medium transition-all duration-300 ${activeTab === "weekly" ? "bg-gradient-to-r from-pink-600/30 to-purple-600/30 text-white text-glow-pink" : "text-purple-300 hover:text-white"}`} onClick={() => setActiveTab("weekly")}>Weekly Vibe</button>
                <button className={`flex-1 py-4 px-6 text-center font-medium transition-all duration-300 ${activeTab === "compatibility" ? "bg-gradient-to-r from-pink-600/30 to-purple-600/30 text-white text-glow-pink" : "text-purple-300 hover:text-white"}`} onClick={() => setActiveTab("compatibility")}>Compatibility</button>
            </div>
            <div className="p-6">
                {activeTab === "weekly" ? (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-glow-pink">Your Weekly Music Vibe</h2>
                        <p className="text-purple-200">With {chartData.mars?.sign} in {MUSIC_SIGNS[chartData.mars?.sign as keyof typeof MUSIC_SIGNS || "Pop"]?.element} transiting your{" "} {chartData.sun.sign} sun this week, it's time to embrace high-energy anthems that combine catchy hooks with powerful riffs.</p>
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-glow">This week's Recommendations:</h3>
                            <ul className="space-y-3">
                                {recommendations.map((rec, index) => (
                                    <li key={index} className="flex items-start">
                                        <span className="w-6 h-6 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex-shrink-0 mr-3 flex items-center justify-center text-xs">{index + 1}</span>
                                        <span className="text-purple-100">{rec}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-gradient-to-r from-purple-800/30 to-fuchsia-800/30 rounded-lg p-4 border border-purple-500/20">
                            <div className="flex items-center mb-2">
                                <Sun size={18} className="text-yellow-300 mr-2" />
                                <h4 className="font-bold text-yellow-200">Weekend Forecast:</h4>
                            </div>
                            <p className="text-purple-200 text-sm">{forecast}</p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-glow-pink">Musical Compatibility</h2>
                        <p className="text-purple-200">Connect with friends to see your compatibility scores and shared musical elements.</p>
                        <div className="flex justify-center py-4"><Link href="/friends" className="neon-button">Find Friends</Link></div>
                        <div className="bg-gradient-to-r from-purple-800/30 to-fuchsia-800/30 rounded-lg p-4 border border-purple-500/20">
                            <div className="flex items-center mb-2">
                                <Moon size={18} className="text-blue-300 mr-2" />
                                <h4 className="font-bold text-blue-200">Perfect Matches:</h4>
                            </div>
                            <p className="text-purple-200 text-sm">Your {chartData.sun.sign} Sun harmonizes well with Jazz and Classical listeners, while your{" "} {chartData.moon?.sign} Moon creates deep connections with {chartData.moon?.sign} enthusiasts.</p>
                            <div className="mt-4 flex justify-end">
                                <Link href="/compatibility" className="inline-flex items-center text-sm text-pink-300 hover:text-pink-200 transition-colors">
                                    <span>Learn more</span>
                                    <ArrowRight size={14} className="ml-1" />
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
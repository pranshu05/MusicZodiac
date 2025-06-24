"use client"
import { useState, useEffect } from "react"
import type { MusicChartData } from "@/types/lastfm"
import { Sparkles, Music, Clock, Database } from "lucide-react"

interface DiscoveryEngineProps {
    chartData: MusicChartData
}

interface DiscoveryResult {
    artists?: Array<{ name: string; reason: string; chartConnection: string }>
    genres?: Array<{ genre: string; description: string; whyItFits: string }>
    cached?: boolean
    generatedAt?: string
    canRegenerate?: boolean
    nextRegenerateTime?: string
}

export function DiscoveryEngine({ chartData }: DiscoveryEngineProps) {
    const [activeDiscovery, setActiveDiscovery] = useState<"artists" | "genres">("artists")
    const [discoveryResults, setDiscoveryResults] = useState<Record<string, DiscoveryResult>>({})
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const generateDiscovery = async (type: string) => {
        setIsLoading(true)
        setError(null)

        try {
            const response = await fetch("/api/ai/discover", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ chartData, discoveryType: type }),
            })

            if (!response.ok) {
                throw new Error("Failed to generate discovery")
            }

            const result = await response.json()
            setDiscoveryResults((prev) => ({ ...prev, [type]: result }))
        } catch {
            setError("Unable to generate personalized discoveries")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        generateDiscovery("artists")
    }, [])

    const handleTabChange = (tab: typeof activeDiscovery) => {
        setActiveDiscovery(tab)
        if (!discoveryResults[tab]) {
            generateDiscovery(tab)
        }
    }

    const currentResult = discoveryResults[activeDiscovery]

    const formatTimeUntilRegenerate = (nextTime: string) => {
        const now = new Date()
        const next = new Date(nextTime)
        const hoursLeft = Math.ceil((next.getTime() - now.getTime()) / (1000 * 60 * 60))

        if (hoursLeft <= 0) return "Available now"
        if (hoursLeft === 1) return "1 hour"
        return `${hoursLeft} hours`
    }

    return (
        <div className="bg-gradient-to-br from-purple-900/40 to-fuchsia-900/40 backdrop-blur-md rounded-xl p-6 border border-purple-500/20 box-glow">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-glow-pink">AI Music Discovery</h2>
                {currentResult?.cached && (<div className="flex items-center gap-2 text-xs text-purple-400"><Database size={14} /><span>Cached discovery</span></div>)}
            </div>
            <div className="flex gap-2 mb-6">
                {[
                    { key: "artists", label: "Artists", icon: <Music size={16} /> },
                    { key: "genres", label: "Genres", icon: <Sparkles size={16} /> },
                ].map(({ key, label, icon }) => (
                    <button key={key} onClick={() => handleTabChange(key as typeof activeDiscovery)} className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${activeDiscovery === key ? "bg-gradient-to-r from-pink-600/50 to-purple-600/50 text-white text-glow-pink" : "bg-purple-900/30 text-purple-300 hover:text-white hover:bg-purple-800/40"}`}>{icon}<span className="text-sm font-medium">{label}</span></button>
                ))}
            </div>
            {isLoading && (
                <div className="text-center py-12">
                    <div className="w-8 h-8 border-2 border-pink-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-purple-300">AI is discovering your perfect musical matches...</p>
                </div>
            )}
            {error && (
                <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-6">
                    <p className="text-red-300">{error}</p>
                </div>
            )}
            {!isLoading && currentResult && (
                <div className="space-y-4">
                    {activeDiscovery === "artists" && currentResult.artists && (
                        <div className="space-y-3">
                            {currentResult.artists.map((artist, index) => (
                                <div key={index} className="bg-purple-900/30 rounded-lg p-4 border border-purple-500/20 hover:border-purple-500/40 transition-all">
                                    <h4 className="font-bold text-white mb-2">{artist.name}</h4>
                                    <p className="text-purple-200 text-sm mb-2">{artist.reason}</p>
                                    <p className="text-purple-300 text-xs"><span className="font-medium">Chart Connection:</span> {artist.chartConnection}</p>
                                </div>
                            ))}
                        </div>
                    )}
                    {activeDiscovery === "genres" && currentResult.genres && (
                        <div className="space-y-3">
                            {currentResult.genres.map((genre, index) => (
                                <div key={index} className="bg-purple-900/30 rounded-lg p-4 border border-purple-500/20 hover:border-purple-500/40 transition-all">
                                    <h4 className="font-bold text-white mb-2">{genre.genre}</h4>
                                    <p className="text-purple-200 text-sm mb-2">{genre.description}</p>
                                    <p className="text-purple-300 text-xs"><span className="font-medium">Why it fits:</span> {genre.whyItFits}</p>
                                </div>
                            ))}
                        </div>
                    )}
                    <div className="text-center pt-4 space-y-2">
                        <p className="text-xs text-purple-400">✨ Powered by AI • Personalized based on your unique musical chart</p>
                        {currentResult.nextRegenerateTime && (<div className="flex items-center justify-center gap-2 text-xs text-purple-500"><Clock size={12} /><span>Next update available in {formatTimeUntilRegenerate(currentResult.nextRegenerateTime)}</span></div>)}
                    </div>
                </div>
            )}
        </div>
    )
}
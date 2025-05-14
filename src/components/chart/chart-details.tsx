"use client"
import type { MusicChartData } from "@/types/spotify"
import { MUSIC_SIGNS, CHART_POSITIONS } from "@/utils/constants"
import { Music, Star, Sparkles, Heart, Flame, CircleEllipsis, CircleDot, Orbit, Zap, Waves, CircleSlash } from "lucide-react"
import { useState } from "react"

interface ChartDetailsProps {
    chartData: MusicChartData
    username?: string
}

export function ChartDetails({ chartData, username }: ChartDetailsProps) {
    const [expandedPosition, setExpandedPosition] = useState<string | null>(null)

    const getSignIcon = (position: string) => {
        switch (position) {
            case "sun":
                return <Star className="text-yellow-300" />
            case "moon":
                return <Sparkles className="text-blue-300" />
            case "rising":
                return <Music className="text-purple-400" />
            case "venus":
                return <Heart className="text-pink-400" />
            case "mars":
                return <Flame className="text-red-500" />
            case "mercury":
                return <CircleEllipsis className="text-green-400" />
            case "jupiter":
                return <CircleDot className="text-orange-400" />
            case "saturn":
                return <Orbit className="text-gray-500" />
            case "uranus":
                return <Zap className="text-teal-400" />
            case "neptune":
                return <Waves className="text-blue-500" />
            case "pluto":
                return <CircleSlash className="text-purple-600" />
            default:
                return <Music className="text-gray-400" />
        }
    }

    const toggleExpand = (position: string) => {
        if (expandedPosition === position) {
            setExpandedPosition(null)
        } else {
            setExpandedPosition(position)
        }
    }

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-2 text-glow-pink">{username ? `${username}'s` : "Your"} Music Birth Chart</h2>
                <p className="text-purple-200">Based on your Spotify listening habits, we've calculated your unique music zodiac chart.</p>
            </div>
            <div className="space-y-6">
                {Object.entries(chartData).map(([position, data]) => {
                    const positionKey = position as keyof typeof CHART_POSITIONS
                    const sign = MUSIC_SIGNS[data.sign as keyof typeof MUSIC_SIGNS]
                    const isExpanded = expandedPosition === position

                    if (!sign) return null

                    return (
                        <div key={position} className={`bg-gradient-to-br from-purple-900/40 to-fuchsia-900/40 backdrop-blur-md rounded-xl border border-purple-500/20 transition-all duration-500 overflow-hidden ${isExpanded ? "box-glow" : "hover:border-purple-500/40"}`} onClick={() => toggleExpand(position)}>
                            <div className="p-5 cursor-pointer">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isExpanded ? "box-glow-pink" : ""}`} style={{ backgroundColor: sign.color }}>{getSignIcon(position)}</div>
                                    <div className="flex-grow">
                                        <div className="flex items-center"><h3 className={`text-2xl font-bold text-white ${isExpanded ? "text-glow-pink" : ""}`}>{position.charAt(0).toUpperCase() + position.slice(1)} in {data.sign}</h3></div>
                                        <p className="text-purple-200 text-sm">{CHART_POSITIONS[positionKey]}</p>
                                    </div>
                                </div>
                            </div>
                            {isExpanded && (
                                <div className="px-5 pb-5 pt-0 space-y-4">
                                    <div className="h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>
                                    <div className="flex flex-col">
                                        <div className="flex-grow space-y-4">
                                            <div>
                                                <h4 className="text-lg font-semibold text-white mb-2">About Your {data.sign} {position.charAt(0).toUpperCase() + position.slice(1)}</h4>
                                                <p className="text-purple-200">{sign.description}</p>
                                            </div>
                                            {sign.element && sign.planet && (
                                                <div className="flex gap-4">
                                                    <div className="bg-purple-900/40 rounded-lg px-4 py-1 border border-purple-500/20">
                                                        <span className="text-xs text-purple-300">Element</span>
                                                        <p className="font-medium text-white">{sign.element}</p>
                                                    </div>
                                                    <div className="bg-purple-900/40 rounded-lg px-4 py-1 border border-purple-500/20">
                                                        <span className="text-xs text-purple-300">Planet</span>
                                                        <p className="font-medium text-white">{sign.planet}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        {data.artists.length > 0 && (
                                            <div className="w-full mt-4">
                                                <h4 className="text-sm font-medium text-purple-300 mb-3">Top Artists:</h4>
                                                <div className="space-y-3">
                                                    {data.artists.map((artist) => (
                                                        <div key={artist.id} className="flex items-center gap-3 bg-purple-900/40 rounded-lg p-2 border border-purple-500/20">
                                                            {artist.image && artist.image.length > 0 ? (
                                                                <div className="w-10 h-10 rounded-full overflow-hidden"><img src={artist.image} alt={artist.name} width={40} height={40} className="object-cover w-full h-full" /></div>
                                                            ) : (
                                                                <div className="w-10 h-10 rounded-full bg-purple-800 flex items-center justify-center"><Music size={16} className="text-white" /></div>
                                                            )}
                                                            <span className="text-white">{artist.name}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
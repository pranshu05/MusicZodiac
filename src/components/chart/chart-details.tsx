"use client"
import type { MusicChartData } from "@/types/spotify"
import { MUSIC_SIGNS, CHART_POSITIONS } from "@/utils/constants"
import { Music, Star, Sparkles, Heart, Flame, CircleEllipsis, CircleDot, Orbit, Zap, Waves, CircleSlash, ChevronDown, ChevronUp, ExternalLink, } from "lucide-react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ChartDetailsProps {
    chartData: MusicChartData
    username?: string
    selectedPosition?: string | null
    onPositionSelect?: (position: string) => void
}

export function ChartDetails({ chartData, username, selectedPosition, onPositionSelect }: ChartDetailsProps) {
    const [expandedPosition, setExpandedPosition] = useState<string | null>(null)

    useEffect(() => {
        if (selectedPosition) {
            setExpandedPosition(selectedPosition)
        }
    }, [selectedPosition])

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

    useEffect(() => {
        if (!expandedPosition && Object.keys(chartData).length > 0) {
            const firstPosition = Object.keys(chartData)[0]
            setExpandedPosition(firstPosition)
        }
    }, [chartData, expandedPosition])

    const toggleExpand = (position: string) => {
        const newPosition = expandedPosition === position ? null : position
        setExpandedPosition(newPosition)

        if (onPositionSelect) {
            onPositionSelect(newPosition || "")
        }
    }

    return (
        <div className="space-y-8">
            <motion.div className="text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <h2 className="text-3xl font-bold text-white mb-2 text-glow-pink">{username}'s Music Birth Chart</h2>
                <p className="text-purple-200 max-w-2xl mx-auto">A cosmic musical identity revealed through celestial positions. Click on each position to explore unique musical traits and influences.</p>
            </motion.div>
            <div className="space-y-6">
                {Object.entries(chartData).map(([position, data], index) => {
                    const positionKey = position as keyof typeof CHART_POSITIONS
                    const sign = MUSIC_SIGNS[data.sign as keyof typeof MUSIC_SIGNS]
                    const isExpanded = expandedPosition === position

                    if (!sign) return null

                    return (
                        <motion.div key={position} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }} className={`bg-gradient-to-br from-purple-900/40 to-fuchsia-900/40 backdrop-blur-md rounded-xl border transition-all duration-500 overflow-hidden ${isExpanded ? "border-purple-400/50 shadow-lg shadow-purple-500/20 box-glow" : "border-purple-500/20 hover:border-purple-500/40 hover:shadow-md hover:shadow-purple-500/10"}`}>
                            <div className="p-5 cursor-pointer flex items-center justify-between" onClick={() => toggleExpand(position)}>
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${isExpanded ? "box-glow-pink scale-110" : ""}`} style={{ backgroundColor: sign.color }}>{getSignIcon(position)}</div>
                                    <div className="flex-grow">
                                        <div className="flex items-center">
                                            <h3 className={`text-2xl font-bold text-white transition-all duration-300 ${isExpanded ? "text-glow-pink" : ""}`}>{position.charAt(0).toUpperCase() + position.slice(1)} in {data.sign}</h3>
                                        </div>
                                        <p className="text-purple-200 text-sm">{CHART_POSITIONS[positionKey]}</p>
                                    </div>
                                </div>
                            </div>
                            <AnimatePresence>
                                {isExpanded && (
                                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                                        <div className="px-5 pb-5 pt-0 space-y-4">
                                            <div className="h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>
                                            <Tabs defaultValue="about" className="w-full">
                                                <TabsList className="bg-purple-900/40 border border-purple-500/20">
                                                    <TabsTrigger value="about">About</TabsTrigger>
                                                    <TabsTrigger value="artists">Artists</TabsTrigger>
                                                </TabsList>
                                                <TabsContent value="about" className="pt-4">
                                                    <div className="space-y-4">
                                                        <div>
                                                            <h4 className="text-lg font-semibold text-white mb-2">About {username}'s {data.sign} {position.charAt(0).toUpperCase() + position.slice(1)}</h4>
                                                            <p className="text-purple-200">{sign.description}</p>
                                                        </div>
                                                        {sign.element && sign.planet && (
                                                            <div className="flex flex-wrap gap-4">
                                                                <div className="bg-purple-900/40 rounded-lg px-4 py-2 border border-purple-500/20 shadow-sm shadow-purple-500/10">
                                                                    <span className="text-xs text-purple-300">Element</span>
                                                                    <p className="font-medium text-white">{sign.element}</p>
                                                                </div>
                                                                <div className="bg-purple-900/40 rounded-lg px-4 py-2 border border-purple-500/20 shadow-sm shadow-purple-500/10">
                                                                    <span className="text-xs text-purple-300">Planet</span>
                                                                    <p className="font-medium text-white">{sign.planet}</p>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </TabsContent>
                                                <TabsContent value="artists" className="pt-4">
                                                    {data.artists.length > 0 ? (
                                                        <div className="w-full">
                                                            <h4 className="text-sm font-medium text-purple-300 mb-3">Top Artists Influencing {username}'s {position.charAt(0).toUpperCase() + position.slice(1)}:</h4>
                                                            <div className="grid gap-3">
                                                                {data.artists.map((artist) => (
                                                                    <a href={`https://open.spotify.com/artist/${artist.id}`} target="_blank" rel="noopener noreferrer" key={artist.id} className="flex items-center gap-3 bg-purple-900/40 rounded-lg p-3 border border-purple-500/20 hover:border-purple-400/50 hover:bg-purple-800/40 transition-all duration-300 group">
                                                                        {artist.image && artist.image.length > 0 ? (
                                                                            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-transparent group-hover:border-purple-400 transition-all"><img src={artist.image} alt={artist.name} width={48} height={48} className="object-cover w-full h-full" /></div>
                                                                        ) : (
                                                                            <div className="w-12 h-12 rounded-full bg-purple-800 flex items-center justify-center"><Music size={20} className="text-white" /></div>
                                                                        )}
                                                                        <div className="flex-grow">
                                                                            <span className="text-white font-medium block">{artist.name}</span>
                                                                            <span className="text-xs text-purple-300 flex items-center gap-1">View on Spotify <ExternalLink size={12} /></span>
                                                                        </div>
                                                                    </a>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="text-center py-6 text-purple-300">
                                                            <Music size={32} className="mx-auto mb-2 opacity-50" />
                                                            <p>No artist data available for this position</p>
                                                        </div>
                                                    )}
                                                </TabsContent>
                                            </Tabs>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    )
                })}
            </div>
        </div>
    )
}
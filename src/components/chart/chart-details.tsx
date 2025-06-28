"use client"
import type { MusicChartData } from "@/types/lastfm"
import { MUSIC_SIGNS, CHART_POSITIONS } from "@/utils/constants"
import { Music, Star, Sparkles, Heart, Flame, CircleEllipsis, CircleDot, Orbit, Zap, Waves, CircleSlash, ChevronDown, ExternalLink, } from "lucide-react"
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
        <div className="space-y-6">
            <motion.div className="text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 text-glow-pink">{username ? `${username}'s` : "Your"} Music Birth Chart</h2>
                <p className="text-purple-200 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">A cosmic musical identity revealed through celestial positions. Click on each position to explore unique musical traits and influences.</p>
            </motion.div>
            <div className="space-y-4">
                {Object.entries(chartData).filter(([_, data]) => data.sign && data.artists.length > 0).map(([position, data], index) => {
                    const positionKey = position as keyof typeof CHART_POSITIONS
                    const sign = MUSIC_SIGNS[data.sign as keyof typeof MUSIC_SIGNS]
                    const isExpanded = expandedPosition === position

                    if (!sign) return null

                    return (
                        <motion.div key={position} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }} className={`bg-gradient-to-br from-purple-900/40 to-fuchsia-900/40 backdrop-blur-md rounded-2xl border transition-all duration-500 overflow-hidden ${isExpanded ? "border-purple-400/60 shadow-lg shadow-purple-500/20 box-glow" : "border-purple-500/20 hover:border-purple-500/40 hover:shadow-md hover:shadow-purple-500/10"}`}>
                            <motion.div className="p-4 sm:p-5 cursor-pointer flex items-center justify-between group" onClick={() => toggleExpand(position)} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                                <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-grow">
                                    <motion.div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0 ${isExpanded ? "box-glow-pink scale-110" : "group-hover:scale-105"}`} style={{ backgroundColor: sign.color }} animate={{ boxShadow: isExpanded ? `0 0 20px ${sign.color}40, 0 0 40px ${sign.color}20` : "none", }}>{getSignIcon(position)}</motion.div>
                                    <div className="flex-grow min-w-0">
                                        <div className="flex items-center gap-2"><h3 className={`text-lg sm:text-2xl font-bold text-white transition-all duration-300 truncate ${isExpanded ? "text-glow-pink" : "group-hover:text-pink-300"}`}>{position.charAt(0).toUpperCase() + position.slice(1)} in {data.sign}</h3></div>
                                        <p className="text-purple-200 text-xs sm:text-sm leading-relaxed">{CHART_POSITIONS[positionKey]}</p>
                                    </div>
                                </div>
                                <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.3 }} className="flex-shrink-0 ml-2">
                                    <ChevronDown className="w-5 h-5 text-purple-400 group-hover:text-white transition-colors" />
                                </motion.div>
                            </motion.div>
                            <AnimatePresence>
                                {isExpanded && (
                                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: "easeInOut" }} className="overflow-hidden">
                                        <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-0 space-y-4">
                                            <div className="h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>
                                            <Tabs defaultValue="about" className="w-full">
                                                <TabsList className="bg-purple-900/40 border border-purple-500/20 w-full sm:w-auto">
                                                    <TabsTrigger value="about" className="text-xs sm:text-sm">About</TabsTrigger>
                                                    <TabsTrigger value="artists" className="text-xs sm:text-sm">Artists</TabsTrigger>
                                                </TabsList>
                                                <TabsContent value="about" className="pt-4">
                                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-4">
                                                        <div>
                                                            <h4 className="text-base sm:text-lg font-semibold text-white mb-3">About {username ? `${username}'s` : "Your"} {data.sign}{" "} {position.charAt(0).toUpperCase() + position.slice(1)}</h4>
                                                            <p className="text-purple-200 text-sm leading-relaxed">{sign.description}</p>
                                                        </div>
                                                        {sign.element && sign.planet && (
                                                            <div className="flex flex-wrap gap-3">
                                                                <div className="bg-purple-900/40 rounded-xl px-4 py-3 border border-purple-500/20 shadow-sm shadow-purple-500/10 flex-1 min-w-0">
                                                                    <span className="text-xs text-purple-300 block mb-1">Element</span>
                                                                    <p className="font-medium text-white text-sm">{sign.element}</p>
                                                                </div>
                                                                <div className="bg-purple-900/40 rounded-xl px-4 py-3 border border-purple-500/20 shadow-sm shadow-purple-500/10 flex-1 min-w-0">
                                                                    <span className="text-xs text-purple-300 block mb-1">Planet</span>
                                                                    <p className="font-medium text-white text-sm">{sign.planet}</p>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </motion.div>
                                                </TabsContent>
                                                <TabsContent value="artists" className="pt-4">
                                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                                                        {data.artists.length > 0 ? (
                                                            <div className="w-full">
                                                                <h4 className="text-sm font-medium text-purple-300 mb-4">Top Artists Influencing {username ? `${username}'s` : "Your"}{" "} {position.charAt(0).toUpperCase() + position.slice(1)}:</h4>
                                                                <div className="grid gap-3">
                                                                    {data.artists.map((artist, artistIndex) => (
                                                                        <motion.a key={artist.id} href={`https://last.fm/music/${encodeURIComponent(artist.name)}`} target="_blank" rel="noopener noreferrer" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: artistIndex * 0.1 }} className="flex items-center gap-3 bg-purple-900/40 rounded-xl p-3 border border-purple-500/20 hover:border-purple-400/50 hover:bg-purple-800/40 transition-all duration-300 group" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                                                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center flex-shrink-0"><Music size={16} className="text-white" /></div>
                                                                            <div className="flex-grow min-w-0">
                                                                                <span className="text-white font-medium block text-sm sm:text-base truncate group-hover:text-pink-300 transition-colors">{artist.name}</span>
                                                                                <span className="text-xs text-purple-300 flex items-center gap-1">View on Last.fm <ExternalLink size={10} /></span>
                                                                            </div>
                                                                        </motion.a>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="text-center py-8">
                                                                <Music size={32} className="mx-auto mb-3 opacity-50 text-purple-400" />
                                                                <h4 className="text-white font-medium mb-1">No Artist Data</h4>
                                                                <p className="text-purple-300 text-sm">No artist data available for this position</p>
                                                            </div>
                                                        )}
                                                    </motion.div>
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
"use client"
import type { MusicChartData } from "@/types/lastfm"
import { MUSIC_SIGNS, type CHART_POSITIONS } from "@/utils/constants"
import { cn } from "@/utils/cn"
import { Info, Orbit } from "lucide-react"
import { useEffect, useRef, useState, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface StarChartProps {
    chartData: MusicChartData
    className?: string
    onPositionSelect?: (position: string) => void
    selectedPosition?: string | null
}

export function StarChart({ chartData, className }: StarChartProps) {
    const svgRef = useRef<SVGSVGElement>(null)
    const [dimensions, setDimensions] = useState({ width: 300, height: 300 })
    const [isMounted, setIsMounted] = useState(false)
    const [hoveredPosition, setHoveredPosition] = useState<string | null>(null)

    const { centerX, centerY, radius } = useMemo(() => {
        const centerX = dimensions.width / 2
        const centerY = dimensions.height / 2
        const radius = Math.min(centerX, centerY) * 0.85
        return { centerX, centerY, radius }
    }, [dimensions])

    const positions = useMemo(() => {
        const orbitalDistances = {
            sun: 0,
            mercury: radius * 0.25,
            venus: radius * 0.35,
            moon: radius * 0.45,
            mars: radius * 0.55,
            jupiter: radius * 0.65,
            saturn: radius * 0.75,
            uranus: radius * 0.81,
            neptune: radius * 0.88,
            pluto: radius * 0.95,
            rising: radius * 0.55
        }

        return {
            sun: {
                x: centerX,
                y: centerY,
                radius: radius * 0.12,
            },
            mercury: {
                x: centerX + orbitalDistances.mercury * Math.cos(Math.PI * 0.5),
                y: centerY + orbitalDistances.mercury * Math.sin(Math.PI * 0.5),
                radius: radius * 0.05,
            },
            venus: {
                x: centerX + orbitalDistances.venus * Math.cos(Math.PI * 1.2),
                y: centerY + orbitalDistances.venus * Math.sin(Math.PI * 1.2),
                radius: radius * 0.07,
            },
            moon: {
                x: centerX + orbitalDistances.moon * Math.cos(Math.PI * 1.7),
                y: centerY + orbitalDistances.moon * Math.sin(Math.PI * 1.7),
                radius: radius * 0.06,
            },
            mars: {
                x: centerX + orbitalDistances.mars * Math.cos(Math.PI * 0.9),
                y: centerY + orbitalDistances.mars * Math.sin(Math.PI * 0.9),
                radius: radius * 0.07,
            },
            rising: {
                x: centerX + orbitalDistances.rising * Math.cos(Math.PI * 0.2),
                y: centerY + orbitalDistances.rising * Math.sin(Math.PI * 0.2),
                radius: radius * 0.08,
            },
            jupiter: {
                x: centerX + orbitalDistances.jupiter * Math.cos(Math.PI * 1.5),
                y: centerY + orbitalDistances.jupiter * Math.sin(Math.PI * 1.5),
                radius: radius * 0.1,
            },
            saturn: {
                x: centerX + orbitalDistances.saturn * Math.cos(Math.PI * 0.3),
                y: centerY + orbitalDistances.saturn * Math.sin(Math.PI * 0.3),
                radius: radius * 0.09,
            },
            uranus: {
                x: centerX + orbitalDistances.uranus * Math.cos(Math.PI * 1.9),
                y: centerY + orbitalDistances.uranus * Math.sin(Math.PI * 1.9),
                radius: radius * 0.075,
            },
            neptune: {
                x: centerX + orbitalDistances.neptune * Math.cos(Math.PI * 1.1),
                y: centerY + orbitalDistances.neptune * Math.sin(Math.PI * 1.1),
                radius: radius * 0.075,
            },
            pluto: {
                x: centerX + orbitalDistances.pluto * Math.cos(Math.PI * 0.6),
                y: centerY + orbitalDistances.pluto * Math.sin(Math.PI * 0.6),
                radius: radius * 0.04,
            },
        }
    }, [centerX, centerY, radius])

    useEffect(() => {
        setIsMounted(true)
        const updateDimensions = () => {
            if (svgRef.current) {
                const { width } = svgRef.current.getBoundingClientRect()
                setDimensions({ width, height: width })
            }
        }

        updateDimensions()
        window.addEventListener("resize", updateDimensions)

        return () => {
            window.removeEventListener("resize", updateDimensions)
        }
    }, [])

    const getSignColor = useCallback((sign: string) => {
        return MUSIC_SIGNS[sign as keyof typeof MUSIC_SIGNS]?.color || "#FFFFFF"
    }, [])

    const getSignGradientId = useCallback((position: string, sign: string) => {
        return `${position}-${sign.toLowerCase().replace(/\s+/g, "-")}-gradient`
    }, [])

    if (!isMounted) {
        return (
            <div className={cn("relative w-full", className)}>
                <div className="w-full aspect-square bg-gradient-to-br from-purple-900/20 to-fuchsia-900/20 rounded-2xl flex items-center justify-center border border-purple-500/20">
                    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }} className="text-white flex flex-col items-center">
                        <Orbit className="h-12 w-12 mb-3 text-purple-300" />
                        <p className="text-lg font-medium">Generating cosmic chart...</p>
                    </motion.div>
                </div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mt-6 bg-gradient-to-br from-purple-900/40 to-fuchsia-900/40 backdrop-blur-md rounded-xl p-4 border border-purple-500/20">
                    <div className="flex items-start gap-3">
                        <Info className="text-pink-400 mt-1 flex-shrink-0" size={20} />
                        <p className="text-gray-300 text-sm">Music zodiac chart is being prepared...</p>
                    </div>
                </motion.div>
            </div>
        )
    }

    return (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, ease: "easeOut" }} className={cn("relative w-full", className)}>
            <div className="relative ">
                <svg ref={svgRef} viewBox={`0 0 ${dimensions.width} ${dimensions.height}`} className="w-full h-auto drop-shadow-2xl" aria-label="Music Zodiac Star Chart">
                    <defs>
                        <radialGradient id="bg-gradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                            <stop offset="0%" stopColor="#9900ff" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#1a0044" stopOpacity="0.9" />
                        </radialGradient>
                        {Object.entries(chartData).map(([position, data]) => (
                            <radialGradient key={`gradient-${position}`} id={getSignGradientId(position, data.sign)} cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                                <stop offset="0%" stopColor={getSignColor(data.sign)} stopOpacity="0.9" />
                                <stop offset="100%" stopColor={getSignColor(data.sign)} stopOpacity="0.4" />
                            </radialGradient>
                        ))}
                        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="8" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                        <filter id="glow-intense" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="4" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                    </defs>
                    <circle cx={centerX} cy={centerY} r={radius} fill="url(#bg-gradient)" stroke="none" />
                    <g className="orbital-rings" strokeOpacity="0.2" strokeWidth="1" fill="none">{[0.25, 0.35, 0.45, 0.55, 0.65, 0.75, 0.85, 0.95].map((distance, index) => (<circle key={index} cx={centerX} cy={centerY} r={radius * distance} stroke="#ff00ff" strokeDasharray="3,3" />))}</g>
                    <g className="constellation-lines" strokeOpacity="0.15" strokeWidth="1">{Object.entries(positions).flatMap(([pos1, data1], index) => Object.entries(positions).slice(index + 1).map(([pos2, data2]) => (<line key={`${pos1}-${pos2}`} x1={data1.x} y1={data1.y} x2={data2.x} y2={data2.y} stroke="#ff00ff" strokeDasharray="2,4" />)),)}</g>
                    {Object.entries(positions).map(([position, pos], index) => {
                        const positionKey = position as keyof typeof CHART_POSITIONS
                        const signData = chartData[positionKey]
                        if (!signData) return null

                        const gradientId = getSignGradientId(position, signData.sign)
                        const isHovered = hoveredPosition === position
                        const isActive = isHovered

                        return (
                            <motion.g key={position} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.1, duration: 0.6, ease: "backOut" }} onMouseEnter={() => setHoveredPosition(position)} onMouseLeave={() => setHoveredPosition(null)} className="cursor-pointer">
                                <circle cx={centerX} cy={centerY} r={Math.sqrt(Math.pow(pos.x - centerX, 2) + Math.pow(pos.y - centerY, 2))} fill="none" stroke={getSignColor(signData.sign)} strokeWidth={isActive ? "2" : "1"} strokeOpacity={isActive ? "0.8" : "0.3"} strokeDasharray={isActive ? "8,4" : "4,4"} className="transition-all duration-300" />
                                <AnimatePresence>{isActive && (<motion.circle initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 0.4, scale: 1.5 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 0.3 }} cx={pos.x} cy={pos.y} r={pos.radius * 2} fill={`url(#${gradientId})`} filter="url(#glow)" />)}</AnimatePresence>
                                <motion.circle cx={pos.x} cy={pos.y} r={pos.radius} fill={`url(#${gradientId})`} stroke={getSignColor(signData.sign)} strokeWidth={isActive ? "2" : "1.5"} filter={isActive ? "url(#glow-intense)" : ""} animate={{ scale: isActive ? 1.2 : 1, strokeWidth: isActive ? 2 : 1.5, }} transition={{ duration: 0.2 }} />
                                <text x={pos.x} y={pos.y} textAnchor="middle" dominantBaseline="middle" fill="white" fontSize={pos.radius * (isActive ? 1.1 : 0.9)} fontWeight="bold" className="pointer-events-none select-none drop-shadow-lg">{position.charAt(0).toUpperCase()}</text>
                            </motion.g>
                        )
                    })}
                </svg>
            </div>
        </motion.div>
    )
}
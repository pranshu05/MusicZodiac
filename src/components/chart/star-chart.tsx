"use client"
import type { MusicChartData } from "@/types/spotify"
import { MUSIC_SIGNS, CHART_POSITIONS } from "@/utils/constants"
import { cn } from "@/utils/cn"
import { Info, Orbit } from "lucide-react"
import { useEffect, useRef, useState, useCallback, useMemo } from "react"

interface StarChartProps {
    chartData: MusicChartData
    className?: string
}

export function StarChart({ chartData, className }: StarChartProps) {
    const svgRef = useRef<SVGSVGElement>(null)
    const [dimensions, setDimensions] = useState({ width: 300, height: 300 })
    const [isMounted, setIsMounted] = useState(false)

    const { centerX, centerY, radius } = useMemo(() => {
        const centerX = dimensions.width / 2
        const centerY = dimensions.height / 2
        const radius = Math.min(centerX, centerY) * 0.85
        return { centerX, centerY, radius }
    }, [dimensions])

    const positions = useMemo(() => {
        return {
            sun: {
                x: centerX,
                y: centerY - radius * 0.7,
                radius: radius * 0.15,
            },
            moon: {
                x: centerX + radius * 0.7,
                y: centerY,
                radius: radius * 0.12,
            },
            rising: {
                x: centerX,
                y: centerY + radius * 0.7,
                radius: radius * 0.12,
            },
            venus: {
                x: centerX - radius * 0.5,
                y: centerY + radius * 0.5,
                radius: radius * 0.1,
            },
            mars: {
                x: centerX - radius * 0.5,
                y: centerY - radius * 0.5,
                radius: radius * 0.1,
            },
            mercury: {
                x: centerX + radius * 0.5,
                y: centerY - radius * 0.5,
                radius: radius * 0.1,
            },
            jupiter: {
                x: centerX + radius * 0.5,
                y: centerY + radius * 0.5,
                radius: radius * 0.1,
            },
            saturn: {
                x: centerX - radius * 0.7,
                y: centerY - radius * 0.7,
                radius: radius * 0.1,
            },
            neptune: {
                x: centerX - radius * 0.7,
                y: centerY + radius * 0.7,
                radius: radius * 0.1,
            },
            pluto: {
                x: centerX + radius * 0.7,
                y: centerY - radius * 0.7,
                radius: radius * 0.1,
            },
            uranus: {
                x: centerX + radius * 0.7,
                y: centerY + radius * 0.7,
                radius: radius * 0.1,
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


    const stars = useMemo(() => {
        return Array.from({ length: 20 }).map((_, i) => {
            const x = Math.random() * dimensions.width
            const y = Math.random() * dimensions.height
            const size = Math.random() * 2 + 1
            const opacity = Math.random() * 0.7 + 0.3

            return (
                <circle key={`star-${i}`} cx={x} cy={y} r={size} fill="white" opacity={opacity} className="animate-pulse" style={{ animationDuration: `${Math.random() * 3 + 2}s` }} />
            )
        })
    }, [dimensions])

    if (!isMounted) {
        return (
            <div className={cn("relative w-full", className)}>
                <div className="w-full aspect-square bg-indigo-950/20 rounded-full flex items-center justify-center"><p className="text-white animate-pulse">Horoscope is generating...</p></div>
                <div className="mt-6 bg-gradient-to-br from-purple-900/40 to-fuchsia-900/40 backdrop-blur-md rounded-xl p-4 border border-purple-500/20">
                    <div className="flex items-start gap-3">
                        <Info className="text-pink-400 mt-1 flex-shrink-0" size={20} />
                        <p className="text-gray-300">Music zodiac chart is being prepared...</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className={cn("relative w-full", className)}>
            <svg ref={svgRef} viewBox={`0 0 ${dimensions.width} ${dimensions.height}`} className="w-full h-auto" aria-label="Music Zodiac Star Chart">
                <defs>
                    <radialGradient id="bg-gradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                        <stop offset="0%" stopColor="#9900ff" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#1a0044" stopOpacity="0.8" />
                    </radialGradient>
                    {Object.entries(chartData).map(([position, data]) => (
                        <radialGradient key={`gradient-${position}`} id={getSignGradientId(position, data.sign)} cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                            <stop offset="0%" stopColor={getSignColor(data.sign)} stopOpacity="0.8" />
                            <stop offset="100%" stopColor={getSignColor(data.sign)} stopOpacity="0.3" />
                        </radialGradient>
                    ))}
                    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="10" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>
                <circle cx={centerX} cy={centerY} r={radius * 1.1} fill="none" stroke="#6B46C1" strokeWidth="1" strokeOpacity="0.1" />
                <circle cx={centerX} cy={centerY} r={radius * 0.9} fill="none" stroke="#ff00ff" strokeWidth="1" strokeOpacity="0.1" />
                <circle cx={centerX} cy={centerY} r={radius} fill="url(#bg-gradient)" stroke="url(#bg-gradient)" strokeWidth="2" />
                <g className="constellation-lines" strokeOpacity="0.3" strokeWidth="1">
                    <line x1={positions.sun.x} y1={positions.sun.y} x2={positions.moon.x} y2={positions.moon.y} stroke="#ff00ff" strokeDasharray="5,5" />
                    <line x1={positions.moon.x} y1={positions.moon.y} x2={positions.rising.x} y2={positions.rising.y} stroke="#ff00ff" strokeDasharray="5,5" />
                    <line x1={positions.rising.x} y1={positions.rising.y} x2={positions.venus.x} y2={positions.venus.y} stroke="#ff00ff" strokeDasharray="5,5" />
                    <line x1={positions.venus.x} y1={positions.venus.y} x2={positions.mars.x} y2={positions.mars.y} stroke="#ff00ff" strokeDasharray="5,5" />
                    <line x1={positions.mars.x} y1={positions.mars.y} x2={positions.sun.x} y2={positions.sun.y} stroke="#ff00ff" strokeDasharray="5,5" />
                    <line x1={positions.mercury.x} y1={positions.mercury.y} x2={positions.jupiter.x} y2={positions.jupiter.y} stroke="#ff00ff" strokeDasharray="5,5" />
                    <line x1={positions.jupiter.x} y1={positions.jupiter.y} x2={positions.saturn.x} y2={positions.saturn.y} stroke="#ff00ff" strokeDasharray="5,5" />
                    <line x1={positions.saturn.x} y1={positions.saturn.y} x2={positions.neptune.x} y2={positions.neptune.y} stroke="#ff00ff" strokeDasharray="5,5" />
                    <line x1={positions.neptune.x} y1={positions.neptune.y} x2={positions.pluto.x} y2={positions.pluto.y} stroke="#ff00ff" strokeDasharray="5,5" />
                    <line x1={positions.pluto.x} y1={positions.pluto.y} x2={positions.uranus.x} y2={positions.uranus.y} stroke="#ff00ff" strokeDasharray="5,5" />
                    <line x1={positions.uranus.x} y1={positions.uranus.y} x2={positions.sun.x} y2={positions.sun.y} stroke="#ff00ff" strokeDasharray="5,5" />
                </g>
                <g>
                    <circle cx={centerX} cy={centerY} r={radius * 0.25} fill="url(#bg-gradient)" stroke="#ff00ff" strokeWidth="2" />
                    <text x={centerX} y={centerY} textAnchor="middle" dominantBaseline="middle" fill="white" fontSize={radius * 0.15} fontWeight="bold"><Orbit /></text>
                </g>
                {Object.entries(positions).map(([position, pos]) => {
                    const positionKey = position as keyof typeof CHART_POSITIONS
                    const signData = chartData[positionKey]
                    if (!signData) return null

                    const gradientId = getSignGradientId(position, signData.sign)

                    return (
                        <g key={position} className={`transition-opacity duration-300`} >
                            <circle cx={centerX} cy={centerY} r={Math.sqrt(Math.pow(pos.x - centerX, 2) + Math.pow(pos.y - centerY, 2))} fill="none" stroke={getSignColor(signData.sign)} strokeWidth="1" strokeOpacity="0.2" strokeDasharray="3,3" />
                            <circle cx={pos.x} cy={pos.y} r={pos.radius * 1.5} fill={`url(#${gradientId})`} />
                            <circle cx={pos.x} cy={pos.y} r={pos.radius} fill={`url(#${gradientId})`} stroke={getSignColor(signData.sign)} />
                            <text x={pos.x} y={pos.y} textAnchor="middle" dominantBaseline="middle" fill="white" fontSize={pos.radius * 0.8} fontWeight="bold">{position.charAt(0).toUpperCase()}</text>
                        </g>
                    )
                })}
                {stars}
            </svg>
        </div>
    )
}
"use client"
import { useEffect, useRef } from "react"
import { SpotifyLogin } from "@/components/auth/spotify-login"
import { Music, Disc, Headphones, Star } from "lucide-react"

export function HeroSection() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        const setCanvasDimensions = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight * 0.7
        }

        setCanvasDimensions()
        window.addEventListener("resize", setCanvasDimensions)

        const stars: { x: number; y: number; radius: number; color: string; speed: number }[] = []

        for (let i = 0; i < 100; i++) {
            const x = Math.random() * canvas.width
            const y = Math.random() * canvas.height
            const radius = Math.random() * 2
            const colors = ["#ffffff", "#ff00ff", "#00ffff", "#ffff00"]
            const color = colors[Math.floor(Math.random() * colors.length)]
            const speed = Math.random() * 0.5 + 0.1

            stars.push({ x, y, radius, color, speed })
        }

        let animationFrameId: number

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            stars.forEach((star) => {
                ctx.beginPath()
                ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
                ctx.fillStyle = star.color
                ctx.fill()

                star.y += star.speed

                if (star.y > canvas.height) {
                    star.y = 0
                    star.x = Math.random() * canvas.width
                }
            })

            animationFrameId = requestAnimationFrame(animate)
        }

        animate()

        return () => {
            window.removeEventListener("resize", setCanvasDimensions)
            cancelAnimationFrame(animationFrameId)
        }
    }, [])

    return (
        <div className="relative min-h-[70vh] flex flex-col items-center justify-center text-center overflow-hidden mb-16">
            <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full z-0" />
            <div className="relative max-w-3xl mx-auto px-4">
                <div className="mb-8 flex justify-center"><div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center box-glow-pink pulse"><Music size={48} className="text-white" /></div></div>
                <h1 className="text-4xl md:text-6xl font-bold mb-6 text-glow-pink">Discover Your Music Zodiac</h1>
                <p className="text-xl md:text-2xl mb-8 text-purple-200">Your Spotify listening habits reveal your cosmic musical identity</p>
                <div className="mb-12"><SpotifyLogin className="scale-125" /></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        {
                            icon: <Star className="text-yellow-300" />,
                            title: "Cosmic Identity",
                            description: "Discover your Sun, Moon, and Rising music signs",
                        },
                        {
                            icon: <Disc className="text-pink-400" />,
                            title: "Weekly Vibes",
                            description: "Get personalized music recommendations based on your chart",
                        },
                        {
                            icon: <Headphones className="text-cyan-400" />,
                            title: "Music Compatibility",
                            description: "Find friends with similar musical tastes",
                        },
                    ].map((feature, index) => (
                        <div key={index} className="bg-gradient-to-br from-purple-900/40 to-fuchsia-900/40 backdrop-blur-md rounded-xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 floating" style={{ animationDelay: `${index * 0.2}s` }}>
                            <div className="flex justify-center mb-4"><div className="p-3 rounded-full bg-purple-800/50">{feature.icon}</div></div>
                            <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                            <p className="text-purple-200 text-sm">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
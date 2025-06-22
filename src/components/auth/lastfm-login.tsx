"use client"
import { useState } from "react"
import { Music } from "lucide-react"

interface LastFmLoginProps {
    className?: string
}

export function LastfmLogin({ className = "" }: LastFmLoginProps) {
    const [isLoading, setIsLoading] = useState(false)

    const handleLogin = async () => {
        setIsLoading(true)

        try {
            const callbackUrl = `${window.location.origin}/api/auth/lastfm/callback`
            const lastFmAuthUrl = `https://www.last.fm/api/auth/?api_key=${process.env.LASTFM_CLIENT_ID}&cb=${encodeURIComponent(callbackUrl)}`

            console.log("Redirecting to Last.fm:", lastFmAuthUrl)

            window.location.href = lastFmAuthUrl
        } catch (error) {
            console.error("Login error:", error)
            setIsLoading(false)
        }
    }

    return (
        <button
            onClick={handleLogin}
            disabled={isLoading}
            className={`neon-button group relative overflow-hidden ${className}`}
        >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#d51007] to-[#ff1a0e] opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"></div>
            <div className="relative z-10 flex items-center justify-center gap-2">
                {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                    <Music size={20} />
                )}
                <span>Connect with Last.fm</span>
            </div>
        </button>
    )
}

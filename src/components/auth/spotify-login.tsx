"use client"
import { signIn } from "next-auth/react"
import { useState } from "react"
import { Music } from "lucide-react"

interface SpotifyLoginProps {
    className?: string
}

export function SpotifyLogin({ className = "" }: SpotifyLoginProps) {
    const [isLoading, setIsLoading] = useState(false)

    const handleLogin = async () => {
        setIsLoading(true)
        await signIn("spotify", { callbackUrl: "/chart" })
    }

    return (
        <button onClick={handleLogin} disabled={isLoading} className={`neon-button group relative overflow-hidden ${className}`}>
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#1DB954] to-[#1ed760] opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"></div>
            <div className="relative z-10 flex items-center justify-center gap-2">
                {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                    <Music size={20} />
                )}
                <span>Connect with Spotify</span>
            </div>
        </button>
    )
}
"use client"
import { useEffect, useState } from "react"
import { signIn } from "next-auth/react"
import { useSearchParams, useRouter } from "next/navigation"
import { Music } from "lucide-react"

export default function LastFmSigninPage() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const token = searchParams.get("token")

        if (!token) {
            setError("No authentication token received")
            setIsLoading(false)
            return
        }

        const handleSignIn = async () => {
            try {
                const result = await signIn("lastfm", { token, redirect: false })

                if (result?.error) {
                    setError(`Authenticating Your Account, Please Wait`)
                } else if (result?.ok) {
                    router.push("/chart")
                } else {
                    setError("Authentication failed for unknown reason")
                    setIsLoading(false)
                }
            } catch {
                setError("Authentication failed")
                setIsLoading(false)
            }
        }

        handleSignIn()
    }, [searchParams, router])

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center box-glow-pink pulse mb-4 mx-auto"><Music size={32} className="text-white" /></div>
                    <h1 className="text-2xl font-bold text-glow-pink mb-2">Connecting to Last.fm</h1>
                    <p className="text-purple-200">Please wait while we set up your account...</p>
                    <div className="mt-4">
                        <div className="w-8 h-8 border-2 border-pink-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="max-w-md mx-auto text-center">
                    <div className="bg-gradient-to-br from-purple-900/40 to-fuchsia-900/40 backdrop-blur-md rounded-xl p-8 border border-purple-500/30 box-glow">
                        <h1 className="text-2xl font-bold text-red-400 mb-4">Authentication Error</h1>
                        <p className="text-purple-200 mb-6">{error}</p>
                        <button onClick={() => router.push("/")} className="neon-button">Return Home</button>
                    </div>
                </div>
            </div>
        )
    }

    return null
}
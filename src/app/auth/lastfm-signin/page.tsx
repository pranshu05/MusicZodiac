"use client"
import { useEffect, useState } from "react"
import { signIn } from "next-auth/react"
import { useSearchParams, useRouter } from "next/navigation"
import { LoadingOverlay } from "@/components/ui/loading-overlay"

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
        return <LoadingOverlay message="Connecting to Last.fm..." />
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
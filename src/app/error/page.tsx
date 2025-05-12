"use client"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { ROUTES } from "@/utils/constants"

export default function ErrorPage() {
    const searchParams = useSearchParams()
    const error = searchParams.get("error")

    let errorMessage = "Something went wrong"

    switch (error) {
        case "AccessDenied":
            errorMessage = "You denied access to your Spotify account. We need this to generate your music chart."
            break
        case "Callback":
            errorMessage = "There was an issue with the Spotify authentication callback."
            break
        default:
            errorMessage = "An unexpected error occurred during authentication."
    }

    return (
        <div className="mx-auto px-4 py-8 space-y-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-6 text-glow-pink">Authentication Error</h1>
                <div className="bg-gradient-to-br from-purple-900/40 to-fuchsia-900/40 backdrop-blur-md rounded-xl p-6 border border-purple-500/20 mb-8">
                    <p className="text-purple-200 mb-6">{errorMessage}</p>
                    <Link href={ROUTES.HOME} className="neon-button">Return Home</Link>
                </div>
            </div>
        </div>
    )
}
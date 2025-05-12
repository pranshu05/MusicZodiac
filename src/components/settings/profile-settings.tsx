"use client"
import { useState } from "react"
import type { User } from "@prisma/client"
import { useRouter } from "next/navigation"

interface ProfileSettingsProps {
    user: User
}

export function ProfileSettings({ user }: ProfileSettingsProps) {
    const router = useRouter()
    const [formData, setFormData] = useState({ name: user.name || "", username: user.username || "", })
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)
        setSuccess(null)

        try {
            const response = await fetch("/api/user/profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || "Failed to update profile")
            }

            setSuccess("Profile updated successfully")

            await fetch('/api/auth/session/update', { method: 'GET' })
            router.refresh()
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="bg-gradient-to-br from-purple-900/40 to-fuchsia-900/40 backdrop-blur-md rounded-xl p-6 border border-purple-500/20 box-glow">
            <h2 className="text-xl font-bold mb-6 text-glow">Profile Settings</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-purple-200 mb-1">Display Name</label>
                    <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="w-full bg-purple-900/30 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500/50" />
                </div>
                <div>
                    <label htmlFor="username" className="block text-sm font-medium text-purple-200 mb-1">Username</label>
                    <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} className="w-full bg-purple-900/30 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500/50" />
                    <p className="text-xs text-purple-300 mt-1">This will be used in your profile URL: music-zodiac.vercel.app/profile/username</p>
                </div>
                {error && <div className="bg-red-900/30 text-red-200 p-3 rounded-lg">{error}</div>}
                {success && <div className="bg-green-900/30 text-green-200 p-3 rounded-lg">{success}</div>}
                <div><button type="submit" disabled={isLoading} className="neon-button">{isLoading ? "Saving..." : "Save Changes"}</button></div>
            </form>
        </div>
    )
}
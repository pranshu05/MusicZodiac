"use client"
import { useState } from "react"
import { UserPlus, Check, Clock, Users } from "lucide-react"

interface AddFriendButtonProps {
    targetUserId: string
    initialStatus?: "none" | "pending" | "accepted" | "sent"
    className?: string
}

export function AddFriendButton({ targetUserId, initialStatus = "none" }: AddFriendButtonProps) {
    const [status, setStatus] = useState<"none" | "pending" | "accepted" | "sent" | "loading">(initialStatus)
    const [error, setError] = useState<string | null>(null)

    const handleSendRequest = async () => {
        setStatus("loading")
        setError(null)

        try {
            const response = await fetch("/api/friends/request", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ friendId: targetUserId }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || "Failed to send friend request")
            }

            setStatus("sent")
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to send friend request")
            setStatus("none")
        }
    }

    const handleAcceptRequest = async () => {
        setStatus("loading")
        setError(null)

        try {
            setStatus("accepted")
        } catch {
            setError("Failed to accept friend request")
            setStatus("pending")
        }
    }

    const getButtonContent = () => {
        switch (status) {
            case "loading":
                return (
                    <>
                        <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span className="hidden sm:inline">Loading...</span>
                    </>
                )
            case "sent":
                return (
                    <>
                        <Clock size={14} className="sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">Sent</span>
                    </>
                )
            case "pending":
                return (
                    <>
                        <Check size={14} className="sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">Accept</span>
                    </>
                )
            case "accepted":
                return (
                    <>
                        <Users size={14} className="sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">Friends</span>
                    </>
                )
            default:
                return (
                    <>
                        <UserPlus size={14} className="sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">Add</span>
                    </>
                )
        }
    }

    const getButtonStyles = () => {
        switch (status) {
            case "loading":
                return "bg-purple-800/50 cursor-not-allowed opacity-75"
            case "sent":
                return "bg-orange-800/50 text-orange-200 cursor-default"
            case "pending":
                return "bg-green-800/50 hover:bg-green-700/50 text-green-200 hover:text-green-100"
            case "accepted":
                return "bg-blue-800/50 text-blue-200 cursor-default"
            default:
                return "bg-purple-800/50 hover:bg-purple-700/50 text-purple-200 hover:text-white"
        }
    }

    const isClickable = status === "none" || status === "pending"

    return (
        <div>
            <button onClick={status === "pending" ? handleAcceptRequest : handleSendRequest} disabled={!isClickable} className={`flex items-center gap-1 sm:gap-2 px-3 py-2 rounded-full transition-all duration-300 font-medium text-xs sm:text-sm ${getButtonStyles()} ${isClickable ? "transform hover:scale-105" : ""}`} aria-label={status === "accepted" ? "Already friends" : status === "sent" ? "Friend request sent" : status === "pending" ? "Accept friend request" : "Send friend request"}>
                {getButtonContent()}
            </button>
            {error && <div className="mt-2 text-xs text-red-400 bg-red-900/20 px-2 py-1 rounded max-w-xs">{error}</div>}
        </div>
    )
}
"use client"
import Link from "next/link"
import { useState } from "react"
import { Check, X } from "lucide-react"
import type { User } from "@prisma/client"

interface FriendRequestsProps {
    requests: {
        id: string
        user: User
    }[]
}

export function FriendRequests({ requests }: FriendRequestsProps) {
    const [pendingRequests, setPendingRequests] = useState(requests)

    const handleAccept = async (requestId: string) => {
        try {
            const response = await fetch(`/api/friends/accept`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ requestId }),
            })

            if (response.ok) {
                setPendingRequests(pendingRequests.filter((req) => req.id !== requestId))
            }
        } catch {
            throw new Error("Failed to accept friend request")
        }
    }

    const handleReject = async (requestId: string) => {
        try {
            const response = await fetch(`/api/friends/reject`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ requestId }),
            })

            if (response.ok) {
                setPendingRequests(pendingRequests.filter((req) => req.id !== requestId))
            }
        } catch {
            throw new Error("Failed to reject friend request")
        }
    }

    return (
        <div className="h-full bg-gradient-to-br from-purple-900/40 to-fuchsia-900/40 backdrop-blur-md rounded-xl p-6 border border-purple-500/20 box-glow">
            <h2 className="text-xl font-bold mb-6 text-glow-pink">Friend Requests</h2>
            {pendingRequests.length > 0 ? (
                <div className="space-y-4">
                    {pendingRequests.map((request) => (
                        <div key={request.id} className="flex items-center justify-between p-3 bg-purple-900/30 rounded-lg border border-purple-500/20">
                            <Link href={`/profile/${request.user.username || request.user.id}`} className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full overflow-hidden">
                                    {request.user.image ? (
                                        <img src={request.user.image} alt={request.user.name || "User"} width={40} height={40} className="object-cover w-full h-full" />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center"><span className="font-bold text-white">{request.user.name?.charAt(0) || "U"}</span></div>
                                    )}
                                </div>
                                <span className="font-medium text-white">{request.user.name || request.user.username || "Music Lover"}</span>
                            </Link>
                            <div className="flex gap-2">
                                <button onClick={() => handleAccept(request.id)} className="p-2 rounded-full bg-green-800/50 hover:bg-green-700/50 transition-colors" aria-label="Accept"><Check size={18} className="text-green-300" /></button>
                                <button onClick={() => handleReject(request.id)} className="p-2 rounded-full bg-red-800/50 hover:bg-red-700/50 transition-colors" aria-label="Reject"><X size={18} className="text-red-300" /></button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8"><p className="text-purple-300">You have no pending friend requests.</p></div>
            )}
        </div>
    )
}
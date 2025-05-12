"use client"
import Link from "next/link"
import { useState } from "react"
import { UserPlus } from "lucide-react"
import type { User } from "@prisma/client"

interface FindFriendsProps {
    potentialFriends: User[]
}

export function FindFriends({ potentialFriends }: FindFriendsProps) {
    const [friends, setFriends] = useState(potentialFriends)
    const [sentRequests, setSentRequests] = useState<string[]>([])

    const handleSendRequest = async (userId: string) => {
        try {
            const response = await fetch(`/api/friends/request`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ friendId: userId }),
            })

            if (response.ok) {
                setSentRequests([...sentRequests, userId])
            }
        } catch (error) {
            console.error("Error sending friend request:", error)
        }
    }

    return (
        <div className="bg-gradient-to-br from-purple-900/40 to-fuchsia-900/40 backdrop-blur-md rounded-xl p-6 border border-purple-500/20 box-glow">
            <h2 className="text-xl font-bold mb-6 text-glow">Find Friends</h2>
            {friends.length > 0 ? (
                <div className="space-y-4">
                    {friends.map((user) => (
                        <div key={user.id} className="flex items-center justify-between p-3 bg-purple-900/30 rounded-lg border border-purple-500/20 hover:border-purple-500/40 transition-all">
                            <Link href={`/profile/${user.username || user.id}`} className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full overflow-hidden">
                                    {user.image ? (
                                        <img src={user.image} alt={user.name || "User"} width={40} height={40} className="object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center"><span className="font-bold text-white">{user.name?.charAt(0) || "U"}</span></div>
                                    )}
                                </div>
                                <span className="font-medium text-white">{user.name || user.username || "Music Lover"}</span>
                            </Link>
                            <button onClick={() => handleSendRequest(user.id)} disabled={sentRequests.includes(user.id)} className={`p-2 rounded-full transition-colors ${sentRequests.includes(user.id) ? "bg-purple-900/30 text-purple-400" : "bg-purple-800/50 hover:bg-purple-700/50 text-pink-300"}`} aria-label="Add friend"><UserPlus size={18} /></button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8"><p className="text-purple-300">No potential friends found at the moment.</p></div>
            )}
        </div>
    )
}
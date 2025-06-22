"use client"
import Link from "next/link"
import { useState } from "react"
import { useSession } from "next-auth/react"
import type { User } from "@prisma/client"
import { AddFriendButton } from "@/components/friends/add-friend-button"

interface FindFriendsProps {
    potentialFriends: User[]
}

export function FindFriends({ potentialFriends }: FindFriendsProps) {
    const { data: session } = useSession()
    const [friends] = useState(potentialFriends)

    if (!session?.user?.id) {
        return null
    }

    return (
        <div className="h-full bg-gradient-to-br from-purple-900/40 to-fuchsia-900/40 backdrop-blur-md rounded-xl p-6 border border-purple-500/20 box-glow">
            <h2 className="text-xl font-bold mb-6 text-glow">Find Friends</h2>
            {friends.length > 0 ? (
                <div className="space-y-4">
                    {friends.map((user) => (
                        <div key={user.id} className="flex items-center justify-between p-3 bg-purple-900/30 rounded-lg border border-purple-500/20 hover:border-purple-500/40 transition-all">
                            <Link href={`/profile/${user.username || user.id}`} className="flex items-center gap-3 flex-grow">
                                <div className="w-10 h-10 rounded-full overflow-hidden">
                                    {user.image ? (
                                        <img src={user.image} alt={user.name || "User"} width={40} height={40} className="object-cover w-full h-full" />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center"><span className="font-bold text-white">{user.name?.charAt(0) || "U"}</span></div>
                                    )}
                                </div>
                                <span className="font-medium text-white">{user.name || user.username || "Music Lover"}</span>
                            </Link>
                            <AddFriendButton targetUserId={user.id} currentUserId={session.user.id} className="ml-2" />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8"><p className="text-purple-300">No potential friends found at the moment.</p></div>
            )}
        </div>
    )
}
import Link from "next/link"
import type { User } from "@prisma/client"

interface FriendsListProps {
    friends: User[]
}

export function FriendsList({ friends }: FriendsListProps) {
    return (
        <div className="bg-gradient-to-br from-purple-900/40 to-fuchsia-900/40 backdrop-blur-md rounded-xl p-6 border border-purple-500/20 box-glow">
            <h2 className="text-xl font-bold mb-6 text-glow">Your Friends</h2>
            {friends.length > 0 ? (
                <div className="space-y-4">
                    {friends.map((friend) => (
                        <div key={friend.id} className="flex items-center justify-between p-3 bg-purple-900/30 rounded-lg border border-purple-500/20 hover:border-purple-500/40 transition-all">
                            <Link href={`/profile/${friend.username || friend.id}`} className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full overflow-hidden">
                                    {friend.image ? (
                                        <img src={friend.image} alt={friend.name || "User"} width={40} height={40} className="object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center"><span className="font-bold text-white">{friend.name?.charAt(0) || "U"}</span></div>
                                    )}
                                </div>
                                <span className="font-medium text-white">{friend.name || friend.username || "Music Lover"}</span>
                            </Link>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8"><p className="text-purple-300">You haven't connected with any friends yet.</p></div>
            )}
        </div>
    )
}
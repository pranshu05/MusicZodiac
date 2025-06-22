import type { User } from "@prisma/client"
import { Music, Calendar } from "lucide-react"

interface ProfileCardProps {
    user: User & { musicChart?: any }
}

export function ProfileCard({ user }: ProfileCardProps) {
    return (
        <div className="bg-gradient-to-br from-purple-900/40 to-fuchsia-900/40 backdrop-blur-md rounded-xl border border-purple-500/20 overflow-hidden box-glow">
            <div className="h-32 bg-gradient-to-r from-purple-600 to-pink-500 relative">
                <div className="absolute -bottom-16 left-8">
                    <div className="w-32 h-32 rounded-full border-4 border-purple-900 overflow-hidden box-glow-pink">
                        {user.image ? (
                            <img src={user.image} alt={user.name || "User"} width={128} height={128} className="object-cover w-full h-full" />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center"><span className="text-4xl font-bold text-white">{user.name?.charAt(0) || "U"}</span></div>
                        )}
                    </div>
                </div>
            </div>
            <div className="pt-20 pb-6 px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white text-glow-pink">{user.name || user.username || "Music Lover"}</h1>
                        {user.username && <p className="text-purple-300">@{user.username}</p>}
                    </div>
                    <div className="flex gap-4 text-sm">
                        <a href={`https://last.fm/user/${user.id}`} target="_blank" className="flex items-center gap-1 text-purple-200"><Music size={16} className="text-pink-400" /><span>Lastfm</span></a>
                        <div className="flex items-center gap-1 text-purple-200"><Calendar size={16} className="text-pink-400" /><span>Joined {new Date(user.createdAt).toLocaleDateString()}</span></div>
                    </div>
                </div>
            </div>
        </div>
    )
}
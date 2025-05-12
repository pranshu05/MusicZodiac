import type { User } from "@prisma/client"
import { Music, Calendar, Settings } from "lucide-react"
import Link from "next/link"
import { ROUTES } from "@/utils/constants"

interface ProfileCardProps {
    user: User & { musicChart?: any }
    isOwnProfile: boolean
}

export function ProfileCard({ user, isOwnProfile }: ProfileCardProps) {
    return (
        <div className="bg-gradient-to-br from-purple-900/40 to-fuchsia-900/40 backdrop-blur-md rounded-xl border border-purple-500/20 overflow-hidden box-glow">
            <div className="h-32 bg-gradient-to-r from-purple-600 to-pink-500 relative">
                <div className="absolute -bottom-16 left-8">
                    <div className="w-32 h-32 rounded-full border-4 border-purple-900 overflow-hidden box-glow-pink">
                        {user.image ? (
                            <img src={user.image} alt={user.name || "User"} width={128} height={128} className="object-cover" />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center"><span className="text-4xl font-bold text-white">{user.name?.charAt(0) || "U"}</span></div>
                        )}
                    </div>
                </div>
                {isOwnProfile && (<div className="absolute top-4 right-4"><Link href={ROUTES.SETTINGS} className="p-2 rounded-full bg-purple-900/60 hover:bg-purple-800/60 transition-colors duration-300" aria-label="Settings"><Settings size={20} className="text-white" /></Link></div>)}
            </div>
            <div className="pt-20 pb-6 px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white text-glow-pink">{user.name || user.username || "Music Lover"}</h1>
                        {user.username && <p className="text-purple-300">@{user.username}</p>}
                    </div>
                    <div className="flex gap-4 text-sm">
                        <a href={`https://open.spotify.com/user/${user.id}`} target="_blank" className="flex items-center gap-1 text-purple-200"><Music size={16} className="text-pink-400" /><span>Spotify</span></a>
                        <div className="flex items-center gap-1 text-purple-200"><Calendar size={16} className="text-pink-400" /><span>Joined {new Date(user.createdAt).toLocaleDateString()}</span></div>
                    </div>
                </div>
            </div>
        </div>
    )
}
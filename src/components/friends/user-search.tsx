"use client"
import { useState } from "react"
import type React from "react"

import { Search, User, UserPlus } from "lucide-react"
import { AddFriendButton } from "@/components/friends/add-friend-button"
import Link from "next/link"

interface SearchUser {
    id: string
    name: string | null
    username: string | null
    image: string | null
    friendshipStatus: "none" | "pending" | "accepted" | "sent"
    requestId: string | null
}

export function UserSearch() {
    const [searchQuery, setSearchQuery] = useState("")
    const [searchResults, setSearchResults] = useState<SearchUser[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [hasSearched, setHasSearched] = useState(false)

    const handleSearch = async (query: string) => {
        if (!query.trim()) {
            setSearchResults([])
            setHasSearched(false)
            return
        }

        setIsLoading(true)
        setHasSearched(true)

        try {
            const response = await fetch(`/api/users/search?q=${encodeURIComponent(query)}`)
            if (response.ok) {
                const data = await response.json()
                setSearchResults(data.users || [])
            } else {
                setSearchResults([])
            }
        } catch {
            setSearchResults([])
        } finally {
            setIsLoading(false)
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setSearchQuery(value)

        const timeoutId = setTimeout(() => {
            handleSearch(value)
        }, 300)

        return () => clearTimeout(timeoutId)
    }

    return (
        <div className="bg-gradient-to-br from-purple-900/40 to-fuchsia-900/40 backdrop-blur-md rounded-xl p-4 sm:p-6 border border-purple-500/20 box-glow">
            <h2 className="text-lg sm:text-xl font-bold mb-4 text-glow">Find Friends</h2>
            <div className="relative mb-6">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Search className="h-5 w-5 text-purple-400" /></div>
                <input type="text" placeholder="Search by username..." value={searchQuery} onChange={handleInputChange} className="w-full pl-10 pr-4 py-3 bg-purple-900/30 border border-purple-500/30 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all" />
            </div>
            <div className="space-y-3">
                {isLoading && (
                    <div className="text-center py-8">
                        <div className="w-8 h-8 border-2 border-pink-400 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                        <p className="text-purple-300">Searching...</p>
                    </div>
                )}
                {!isLoading && hasSearched && searchResults.length === 0 && (
                    <div className="text-center py-8">
                        <User className="h-12 w-12 text-purple-400 mx-auto mb-2" />
                        <p className="text-purple-300">No users found with that username</p>
                    </div>
                )}
                {!isLoading && searchResults.length > 0 && (
                    <div className="space-y-3">
                        <p className="text-sm text-purple-300 mb-3">Found {searchResults.length} user{searchResults.length !== 1 ? "s" : ""}</p>
                        {searchResults.map((user) => (
                            <div key={user.id} className="flex items-center justify-between p-4 bg-purple-900/30 rounded-lg border border-purple-500/20 hover:border-purple-500/40 transition-all">
                                <Link href={`/profile/${user.username || user.id}`} className="flex items-center gap-3 flex-grow">
                                    <div className="w-12 h-12 rounded-full overflow-hidden">
                                        {user.image ? (
                                            <img src={user.image} alt={user.name || "User"} width={48} height={48} className="object-cover w-full h-full" />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center"><span className="font-bold text-white text-lg">{user.name?.charAt(0) || user.username?.charAt(0) || "U"}</span></div>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-white">{user.name || user.username || "Music Lover"}</h3>
                                        {user.username && <p className="text-sm text-purple-300">@{user.username}</p>}
                                    </div>
                                </Link>
                                <div className="ml-4">
                                    <AddFriendButton targetUserId={user.id} initialStatus={user.friendshipStatus} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {!hasSearched && (
                    <div className="text-center py-8">
                        <UserPlus className="h-12 w-12 text-purple-400 mx-auto mb-2" />
                        <p className="text-purple-300">Search for users by their username to add them as friends</p>
                    </div>
                )}
            </div>
        </div>
    )
}
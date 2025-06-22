"use client"
import { useSession } from "next-auth/react";
import Link from "next/link"
import { Github } from "lucide-react"
import { FaProductHunt } from "react-icons/fa";
import { ROUTES } from "@/utils/constants"

export function Footer() {
    const { data: session } = useSession();

    return (
        <footer className="py-8 mt-auto bg-gradient-to-r from-indigo-900 to-purple-900 border-t border-purple-500/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="md:col-span-1">
                        <h3 className="text-lg font-semibold text-white uppercase tracking-wider mb-3">Music Zodiac</h3>
                        <p className="text-sm text-purple-300 mb-6">Discover your musical identity through cosmic connections and celestial harmonies.</p>
                        <a href="https://www.producthunt.com/products/music-zodiac?embed=true&utm_source=badge-featured&utm_medium=badge&utm_source=badge-music&#0045;zodiac" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=981960&theme=dark&t=1750612135378" alt="Music&#0032;Zodiac - Your&#0032;musical&#0032;astrology | Product Hunt" width="250" height="54" /></a>
                    </div>
                    {session && (
                        <>
                            <div className="md:col-span-1">
                                <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Explore</h3>
                                <ul className="space-y-2">
                                    <li><Link href={ROUTES.CHART} className="text-sm text-purple-300 hover:text-white transition-colors">Your Chart</Link></li>
                                    <li><Link href={ROUTES.COMPATIBILITY} className="text-sm text-purple-300 hover:text-white transition-colors">Compatibility</Link></li>
                                    <li><Link href={ROUTES.FRIENDS} className="text-sm text-purple-300 hover:text-white transition-colors">Friends</Link></li>
                                </ul>
                            </div>
                            <div className="md:col-span-1">
                                <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Account</h3>
                                <ul className="space-y-2">
                                    <li><Link href={`${ROUTES.PROFILE}/${session.user.username}`} className="text-sm text-purple-300 hover:text-white transition-colors">Profile</Link></li>
                                    <li><Link href={ROUTES.SETTINGS} className="text-sm text-purple-300 hover:text-white transition-colors">Settings</Link></li>
                                </ul>
                            </div>
                        </>
                    )}
                    <div className="md:col-span-1">
                        <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Connect</h3>
                        <div className="flex space-x-2">
                            <Link href="https://github.com/pranshu05/MusicZodiac" target="_blank" rel="noopener noreferrer" className="text-purple-300 hover:text-white transition-colors"><Github className="h-5 w-5" /></Link>
                            <Link href="https://producthunt.com/products/music-zodiac" target="_blank" rel="noopener noreferrer" className="text-purple-300 hover:text-white transition-colors"><FaProductHunt className="h-5 w-5" /></Link>
                        </div>
                    </div>
                </div>
                <div className="mt-8 pt-6 border-t border-purple-800 text-center text-xs text-purple-300">
                    <p>© {new Date().getFullYear()} Music Zodiac • Cosmic Vibes for Your Ears</p>
                </div>
            </div>
        </footer>
    )
}
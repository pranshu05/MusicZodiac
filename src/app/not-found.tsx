import Link from "next/link"
import { Music, Home, Search, Sparkles } from "lucide-react"
import { ROUTES } from "@/utils/constants"

export default function NotFound() {
    return (
        <div className="mx-auto px-4 py-8 space-y-8 min-h-screen flex items-center justify-center">
            <div className="max-w-4xl mx-auto text-center">
                <div className="mb-8">
                    <h1 className="text-6xl font-bold text-glow-pink mb-4">404</h1>
                    <h2 className="text-3xl font-bold text-white mb-4">Lost in the Cosmos</h2>
                    <p className="text-purple-200 text-lg mb-8 leading-relaxed">Oops! This page seems to have drifted into a musical black hole. The cosmic frequencies couldn't locate what you're looking for.</p>
                </div>
                <div className="bg-gradient-to-br from-purple-900/40 to-fuchsia-900/40 backdrop-blur-md rounded-xl p-4 border border-purple-500/20 box-glow mb-8">
                    <h3 className="text-xl font-bold text-glow mb-6">Navigate Back to Your Musical Universe</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Link href={ROUTES.HOME} className="flex items-center gap-3 p-4 bg-purple-900/30 rounded-lg border border-purple-500/20 hover:border-purple-500/40 hover:bg-purple-800/40 transition-all duration-300 group">
                            <Home className="text-pink-400 group-hover:text-pink-300" size={20} />
                            <div className="text-left">
                                <div className="font-medium text-white group-hover:text-pink-300">Home</div>
                                <div className="text-xs text-purple-300">Return to base</div>
                            </div>
                        </Link>
                        <Link href={ROUTES.CHART} className="flex items-center gap-3 p-4 bg-purple-900/30 rounded-lg border border-purple-500/20 hover:border-purple-500/40 hover:bg-purple-800/40 transition-all duration-300 group">
                            <Music className="text-cyan-400 group-hover:text-cyan-300" size={20} />
                            <div className="text-left">
                                <div className="font-medium text-white group-hover:text-cyan-300">My Chart</div>
                                <div className="text-xs text-purple-300">View your cosmos</div>
                            </div>
                        </Link>
                        <Link href={ROUTES.DISCOVER} className="flex items-center gap-3 p-4 bg-purple-900/30 rounded-lg border border-purple-500/20 hover:border-purple-500/40 hover:bg-purple-800/40 transition-all duration-300 group">
                            <Search className="text-yellow-400 group-hover:text-yellow-300" size={20} />
                            <div className="text-left">
                                <div className="font-medium text-white group-hover:text-yellow-300">Discover</div>
                                <div className="text-xs text-purple-300">Find new music</div>
                            </div>
                        </Link>
                        <Link href={ROUTES.FRIENDS} className="flex items-center gap-3 p-4 bg-purple-900/30 rounded-lg border border-purple-500/20 hover:border-purple-500/40 hover:bg-purple-800/40 transition-all duration-300 group">
                            <Sparkles className="text-purple-400 group-hover:text-purple-300" size={20} />
                            <div className="text-left">
                                <div className="font-medium text-white group-hover:text-purple-300">Friends</div>
                                <div className="text-xs text-purple-300">Connect with others</div>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
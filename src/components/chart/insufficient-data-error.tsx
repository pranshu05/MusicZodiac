import { Music, TrendingUp, Users, Disc } from "lucide-react"
import Link from "next/link"

interface InsufficientDataErrorProps {
    details: {
        artists: number
        tracks: number
        genres: number
    }
}

export function InsufficientDataError({ details }: InsufficientDataErrorProps) {
    return (
        <div className="max-w-2xl mx-auto text-center py-12">
            <div className="bg-gradient-to-br from-purple-900/40 to-fuchsia-900/40 backdrop-blur-md rounded-xl p-8 border border-purple-500/30 box-glow">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center box-glow-pink pulse mb-6 mx-auto"><Music size={40} className="text-white" /></div>
                <h2 className="text-2xl font-bold text-orange-400 mb-4">Not Enough Data Available</h2>
                <p className="text-purple-200 mb-6">We couldn't generate your music zodiac chart because there isn't enough listening data in your Last.fm profile. Your musical journey needs more diversity to create a meaningful cosmic chart.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-purple-900/30 rounded-lg p-4 border border-purple-500/20">
                        <Users size={24} className="text-blue-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white">{details.artists}</div>
                        <div className="text-xs text-purple-300">Artists Found</div>
                        <div className="text-xs text-purple-400 mt-1">Need 5+ artists</div>
                    </div>
                    <div className="bg-purple-900/30 rounded-lg p-4 border border-purple-500/20">
                        <Disc size={24} className="text-green-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white">{details.tracks}</div>
                        <div className="text-xs text-purple-300">Tracks Found</div>
                        <div className="text-xs text-purple-400 mt-1">Need 10+ tracks</div>
                    </div>
                    <div className="bg-purple-900/30 rounded-lg p-4 border border-purple-500/20">
                        <TrendingUp size={24} className="text-pink-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white">{details.genres}</div>
                        <div className="text-xs text-purple-300">Genres Found</div>
                        <div className="text-xs text-purple-400 mt-1">Need 3+ genres</div>
                    </div>
                </div>
                <div className="space-y-4 text-left">
                    <h3 className="text-lg font-bold text-glow-pink">How to fix this:</h3>
                    <ul className="space-y-2 text-purple-200">
                        <li className="flex items-start">
                            <span className="w-6 h-6 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex-shrink-0 mr-3 flex items-center justify-center text-xs font-bold">1</span><span>Connect your music streaming services to Last.fm (Spotify, Apple Music, etc.)</span>
                        </li>
                        <li className="flex items-start">
                            <span className="w-6 h-6 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex-shrink-0 mr-3 flex items-center justify-center text-xs font-bold">2</span><span>Listen to music across different genres and artists</span>
                        </li>
                        <li className="flex items-start">
                            <span className="w-6 h-6 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex-shrink-0 mr-3 flex items-center justify-center text-xs font-bold">3</span><span>Wait a few days for your scrobbles to accumulate</span>
                        </li>
                        <li className="flex items-start">
                            <span className="w-6 h-6 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex-shrink-0 mr-3 flex items-center justify-center text-xs font-bold">4</span><span>Come back and generate your chart again</span>
                        </li>
                    </ul>
                </div>
                <div className="mt-8 space-y-4">
                    <a href="https://www.last.fm/settings/applications" target="_blank" rel="noopener noreferrer" className="neon-button inline-block">Connect Music Services</a>
                    <div><Link href="/" className="text-purple-300 hover:text-white transition-colors">← Return Home</Link></div>
                </div>
            </div>
        </div>
    )
}
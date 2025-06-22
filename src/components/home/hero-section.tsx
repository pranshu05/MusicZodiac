import { LastfmLogin } from "@/components/auth/lastfm-login"
import { Music, Disc, Headphones, Star } from "lucide-react"

export function HeroSection() {
    return (
        <div className="relative min-h-[70vh] flex flex-col items-center justify-center text-center overflow-hidden mb-16">
            <div className="relative max-w-3xl mx-auto px-4">
                <div className="mb-8 flex justify-center"><div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center box-glow-pink pulse"><Music size={48} className="text-white" /></div></div>
                <h1 className="text-4xl md:text-6xl font-bold mb-6 text-glow-pink">Discover Your Music Zodiac</h1>
                <p className="text-xl md:text-2xl mb-8 text-purple-200">Your Lastfm listening habits reveal your cosmic musical identity</p>
                <div className="mb-12"><LastfmLogin className="scale-125" /></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        {
                            icon: <Star className="text-yellow-300" />,
                            title: "Cosmic Identity",
                            description: "Discover your Sun, Moon, and Rising music signs",
                        },
                        {
                            icon: <Disc className="text-pink-400" />,
                            title: "Weekly Vibes",
                            description: "Get personalized music recommendations based on your chart",
                        },
                        {
                            icon: <Headphones className="text-cyan-400" />,
                            title: "Music Compatibility",
                            description: "Find friends with similar musical tastes",
                        },
                    ].map((feature, index) => (
                        <div key={index} className="bg-gradient-to-br from-purple-900/40 to-fuchsia-900/40 backdrop-blur-md rounded-xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 floating" style={{ animationDelay: `${index * 0.2}s` }}>
                            <div className="flex justify-center mb-4"><div className="p-3 rounded-full bg-purple-800/50">{feature.icon}</div></div>
                            <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                            <p className="text-purple-200 text-sm">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
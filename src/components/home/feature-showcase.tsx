export function FeatureShowcase() {
    return (
        <div className="max-w-5xl mx-auto py-12">
            <h2 className="text-3xl font-bold text-center mb-12 text-glow">How Music Zodiac Works</h2>
            <div className="space-y-8">
                <div className="bg-gradient-to-br from-purple-900/40 to-fuchsia-900/40 backdrop-blur-md rounded-xl p-6 border border-purple-500/20 hover:border-purple-500/40">
                    <h3 className="text-2xl font-bold mb-4 text-glow-pink">Connect Your Lastfm</h3>
                    <p className="text-purple-200 mb-4">Link your Lastfm account to analyze your listening habits across different time periods.</p>
                    <p className="text-purple-200 mb-4">We look at your favorite artists, genres, and the audio features of your most-played tracks.</p>
                    <div className="flex items-center space-x-2 text-pink-300"><span className="text-xs">100% secure and private</span></div>
                </div>
                <div className="bg-gradient-to-br from-purple-900/40 to-fuchsia-900/40 backdrop-blur-md rounded-xl p-6 border border-purple-500/20 hover:border-purple-500/40">
                    <h3 className="text-2xl font-bold mb-4 text-glow-blue">Generate Your Chart</h3>
                    <p className="text-purple-200 mb-4">Our algorithm analyzes your music taste and maps it to cosmic positions.</p>
                    <p className="text-purple-200 mb-4">Your Sun sign represents your core musical identity, while your Moon sign reflects your emotional connection to music.</p>
                    <p className="text-purple-200">Venus, Mars, and Rising signs complete your unique musical profile.</p>
                </div>
                <div className="bg-gradient-to-br from-purple-900/40 to-fuchsia-900/40 backdrop-blur-md rounded-xl p-6 border border-purple-500/20 hover:border-purple-500/40">
                    <h3 className="text-2xl font-bold mb-4 text-glow-pink">Discover & Connect</h3>
                    <p className="text-purple-200 mb-4">Find musical soulmates with compatible charts and shared tastes.</p>
                    <p className="text-purple-200">Share your unique chart with friends and on social media.</p>
                </div>
            </div>
        </div>
    )
}
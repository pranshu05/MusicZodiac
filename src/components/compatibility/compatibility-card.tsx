import Link from "next/link";

export const CompatibilityCard = ({ user, score, matchingSigns, matchingArtists, matchingElements }: { user: any; score: number; matchingSigns: string[]; matchingArtists: number; matchingElements: number }) => (
    <Link href={`/profile/${user.username}`} className="block">
        <div className="flex items-center justify-between p-4 bg-purple-900/30 rounded-lg border border-purple-500/20 hover:border-purple-500/40 transition-all">
            <div className="flex items-center gap-4">
                {user.image ? (
                    <img src={user.image} alt="User Avatar" className="w-12 h-12 rounded-full mt-2" />
                ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center"><span className="text-lg font-bold text-white">{user.name?.charAt(0) || "U"}</span></div>
                )}
                <div>
                    <h3 className="font-medium text-white">{user.name || user.username || "Music Lover"}</h3>
                    <div className="hidden lg:flex text-sm text-purple-300">
                        {matchingSigns.length > 0 && <p>Matching: {matchingSigns.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(", ")}</p>}
                        {matchingArtists > 0 && <p>, {matchingArtists} Artists</p>}
                        {matchingElements > 0 && <p>, {matchingElements} Elements</p>}
                    </div>
                </div>
            </div>
            <div className="text-right">
                <div className="text-2xl font-bold text-pink-400 text-glow-pink">{score}%</div>
                <div className="w-24 h-2 bg-purple-900/50 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-pink-500 to-purple-500" style={{ width: `${score}%` }}></div>
                </div>
            </div>
        </div>
    </Link>
);
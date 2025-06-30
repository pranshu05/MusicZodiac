import Link from "next/link"
import { Shield, Eye, Database, Users, Lock, Mail } from "lucide-react"
import { ROUTES } from "@/utils/constants"

export default function PrivacyPolicyPage() {
    return (
        <div className="mx-auto px-4 py-8 space-y-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center box-glow-blue mb-6 mx-auto"><Shield size={32} className="text-white" /></div>
                    <h1 className="text-3xl font-bold text-white mb-4 text-glow-pink">Privacy Policy</h1>
                    <p className="text-purple-200">Your cosmic data is sacred to us</p>
                </div>
                <div className="bg-gradient-to-br from-purple-900/40 to-fuchsia-900/40 backdrop-blur-md rounded-xl p-4 md:p-8 border border-purple-500/20 box-glow space-y-8">
                    <section>
                        <div className="flex items-center gap-3 mb-4"><Eye className="text-pink-400" size={24} /><h2 className="text-xl font-bold text-glow">Information We Collect</h2></div>
                        <div className="space-y-4 text-purple-200">
                            <div>
                                <h3 className="font-semibold text-white mb-2">Last.fm Account Information</h3>
                                <ul className="list-disc list-inside space-y-1 ml-4">
                                    <li>Username and display name</li>
                                    <li>Profile picture (if public)</li>
                                    <li>Listening history and top artists/tracks</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-semibold text-white mb-2">Generated Data</h3>
                                <ul className="list-disc list-inside space-y-1 ml-4">
                                    <li>Your personalized music zodiac chart</li>
                                    <li>AI-generated recommendations and forecasts</li>
                                    <li>Compatibility scores with friends</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-semibold text-white mb-2">Social Features</h3>
                                <ul className="list-disc list-inside space-y-1 ml-4">
                                    <li>Friend connections and requests</li>
                                    <li>User search and discovery data</li>
                                </ul>
                            </div>
                        </div>
                    </section>
                    <section>
                        <div className="flex items-center gap-3 mb-4"><Database className="text-cyan-400" size={24} /><h2 className="text-xl font-bold text-glow">How We Use Your Information</h2></div>
                        <div className="space-y-3 text-purple-200">
                            <div className="bg-purple-900/30 rounded-lg p-4 border border-purple-500/20">
                                <h3 className="font-semibold text-white mb-2">Chart Generation</h3>
                                <p>We analyze your Last.fm listening data to create your unique music zodiac chart and provide personalized insights.</p>
                            </div>
                            <div className="bg-purple-900/30 rounded-lg p-4 border border-purple-500/20">
                                <h3 className="font-semibold text-white mb-2">AI Recommendations</h3>
                                <p>Your chart data is used to generate personalized music recommendations and monthly forecasts using AI.</p>
                            </div>
                            <div className="bg-purple-900/30 rounded-lg p-4 border border-purple-500/20">
                                <h3 className="font-semibold text-white mb-2">Social Features</h3>
                                <p>We enable friend connections and compatibility analysis while respecting your privacy preferences.</p>
                            </div>
                        </div>
                    </section>
                    <section>
                        <div className="flex items-center gap-3 mb-4"><Users className="text-yellow-400" size={24} /><h2 className="text-xl font-bold text-glow">Data Sharing</h2></div>
                        <div className="space-y-4 text-purple-200">
                            <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                                <h3 className="font-semibold text-green-300 mb-2">✓ What We Share</h3>
                                <ul className="list-disc list-inside space-y-1 ml-4">
                                    <li>Your public chart</li>
                                    <li>Compatibility scores with mutual friends</li>
                                </ul>
                            </div>
                            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                                <h3 className="font-semibold text-red-300 mb-2">✗ What We Never Share</h3>
                                <ul className="list-disc list-inside space-y-1 ml-4">
                                    <li>Your raw Last.fm listening data</li>
                                    <li>Personal information with third parties</li>
                                    <li>Data for advertising or marketing purposes</li>
                                    <li>Information without your explicit consent</li>
                                </ul>
                            </div>
                        </div>
                    </section>
                    <section className="border-t border-purple-500/20 pt-6">
                        <h2 className="text-lg font-bold text-white mb-4">Updates to This Policy</h2>
                        <p className="text-purple-200 mb-4">We may update this Privacy Policy from time to time.</p>
                        <p className="text-purple-300 text-sm">By continuing to use Music Zodiac after any changes, you accept the updated Privacy Policy.</p>
                    </section>
                </div>
                <div className="text-center mt-8"><Link href={ROUTES.HOME} className="neon-button">Return to Music Zodiac</Link></div>
            </div>
        </div>
    )
}
import Link from "next/link"
import { FileText, Users, Shield, AlertTriangle, Scale, Mail } from "lucide-react"
import { ROUTES } from "@/utils/constants"

export default function TermsOfServicePage() {
    return (
        <div className="mx-auto px-4 py-8 space-y-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center box-glow-blue mb-6 mx-auto"><FileText size={32} className="text-white" /></div>
                    <h1 className="text-3xl font-bold text-white mb-4 text-glow-pink">Terms of Service</h1>
                    <p className="text-purple-200">The cosmic rules of our musical universe</p>
                </div>
                <div className="bg-gradient-to-br from-purple-900/40 to-fuchsia-900/40 backdrop-blur-md rounded-xl p-4 md:p-8 border border-purple-500/20 box-glow space-y-8">
                    <section>
                        <div className="flex items-center gap-3 mb-4"><Scale className="text-cyan-400" size={24} /><h2 className="text-xl font-bold text-glow">Acceptance of Terms</h2></div>
                        <div className="space-y-4 text-purple-200">
                            <p>By accessing and using Music Zodiac ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.</p>
                            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4"><p className="text-blue-200"><strong>Important:</strong> These terms constitute a legally binding agreement between you and Music Zodiac. Please read them carefully.</p></div>
                        </div>
                    </section>
                    <section>
                        <div className="flex items-center gap-3 mb-4"><Users className="text-pink-400" size={24} /><h2 className="text-xl font-bold text-glow">User Accounts and Responsibilities</h2></div>
                        <div className="space-y-4 text-purple-200">
                            <div>
                                <h3 className="font-semibold text-white mb-2">Account Creation</h3>
                                <ul className="list-disc list-inside space-y-1 ml-4">
                                    <li>You must have a valid Last.fm account to use our service</li>
                                    <li>You are responsible for maintaining the security of your account</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-semibold text-white mb-2">User Conduct</h3>
                                <div className="bg-purple-900/30 rounded-lg p-4 border border-purple-500/20">
                                    <p className="mb-2">You agree to use Music Zodiac responsibly and not to:</p>
                                    <ul className="list-disc list-inside space-y-1 ml-4">
                                        <li>Attempt to hack, reverse engineer, or exploit the service</li>
                                        <li>Create fake profiles or impersonate others</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section>
                        <div className="flex items-center gap-3 mb-4"><Shield className="text-green-400" size={24} /><h2 className="text-xl font-bold text-glow">Service Description and Availability</h2></div>
                        <div className="space-y-4 text-purple-200">
                            <div>
                                <h3 className="font-semibold text-white mb-2">What We Provide</h3>
                                <ul className="list-disc list-inside space-y-1 ml-4">
                                    <li>Music zodiac chart generation based on Last.fm data</li>
                                    <li>AI-powered music recommendations and insights</li>
                                    <li>Social features for connecting with other music lovers</li>
                                    <li>Compatibility analysis and friend discovery</li>
                                </ul>
                            </div>
                            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
                                <h3 className="font-semibold text-yellow-300 mb-2">Service Availability</h3>
                                <p>While we strive for 99.9% uptime, we cannot guarantee uninterrupted service. We may temporarily suspend the service for maintenance, updates, or technical issues.</p>
                            </div>
                        </div>
                    </section>
                    <section>
                        <div className="flex items-center gap-3 mb-4"><FileText className="text-purple-400" size={24} /><h2 className="text-xl font-bold text-glow">Intellectual Property</h2></div>
                        <div className="space-y-4 text-purple-200">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                                    <h3 className="font-semibold text-green-300 mb-2">Your Content</h3>
                                    <ul className="list-disc list-inside space-y-1 ml-2 text-sm">
                                        <li>You own your Last.fm data</li>
                                        <li>You own your generated charts</li>
                                    </ul>
                                </div>
                                <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                                    <h3 className="font-semibold text-blue-300 mb-2">Our Content</h3>
                                    <ul className="list-disc list-inside space-y-1 ml-2 text-sm">
                                        <li>Music Zodiac platform and code</li>
                                        <li>Design and user interface</li>
                                    </ul>
                                </div>
                            </div>
                            <p className="text-sm">By using our service, you grant us a limited license to process your data for chart generation and service provision.</p>
                        </div>
                    </section>
                    <section>
                        <div className="flex items-center gap-3 mb-4"><AlertTriangle className="text-yellow-400" size={24} /><h2 className="text-xl font-bold text-glow">Disclaimers and Limitations</h2>
                        </div>
                        <div className="space-y-4 text-purple-200">
                            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                                <h3 className="font-semibold text-red-300 mb-2">Entertainment Purposes</h3>
                                <p>Music Zodiac is designed for entertainment and discovery purposes only. Our astrological interpretations are not scientific and should not be used for making important life decisions.</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-white mb-2">Limitation of Liability</h3>
                                <p className="text-sm">Music Zodiac and its creator(s) shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-white mb-2">Third-Party Services</h3>
                                <p className="text-sm">We integrate with Last.fm and other third-party services. We are not responsible for their availability, accuracy, or policies. Please review their terms of service separately.</p>
                            </div>
                        </div>
                    </section>
                    <section>
                        <div className="flex items-center gap-3 mb-4"><Scale className="text-blue-400" size={24} /><h2 className="text-xl font-bold text-glow">Termination</h2></div>
                        <div className="space-y-4 text-purple-200">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-purple-900/30 rounded-lg p-4 border border-purple-500/20">
                                    <h3 className="font-semibold text-white mb-2">By Us</h3>
                                    <p className="text-sm">We may terminate accounts that violate these terms or engage in harmful behavior.</p>
                                </div>
                            </div>
                            <p className="text-sm">Upon termination, your access to the service will cease, and we will delete your data in accordance with our Privacy Policy.</p>
                        </div>
                    </section>
                    <section className="border-t border-purple-500/20 pt-6">
                        <h2 className="text-lg font-bold text-white mb-4">Changes to Terms</h2>
                        <p className="text-purple-200 mb-4">We reserve the right to modify these terms at any time. Continued use after changes constitutes acceptance of new terms.</p>
                        <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4"><p className="text-blue-200 text-sm"><strong>Effective Date:</strong> These terms are effective as of the date listed above and remain in effect until modified or terminated.</p></div>
                    </section>
                </div>
                <div className="text-center mt-8 space-y-4">
                    <Link href={ROUTES.HOME} className="neon-button">Return to Music Zodiac</Link>
                    <p className="text-purple-300 text-sm">By using Music Zodiac, you acknowledge that you have read and agree to these Terms of Service.</p>
                </div>
            </div>
        </div>
    )
}
"use client"
import { Twitter, Facebook, LinkIcon } from "lucide-react"
import { useState } from "react"

interface ShareButtonsProps {
    username: string
}

export function ShareButtons({ username }: ShareButtonsProps) {
    const [copied, setCopied] = useState(false)

    const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/profile/${username}` : ""

    const handleCopyLink = () => {
        navigator.clipboard.writeText(shareUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handleShare = (platform: string) => {
        let shareLink = ""

        switch (platform) {
            case "twitter":
                shareLink = `https://twitter.com/intent/tweet?text=Check out my Music Zodiac chart!&url=${encodeURIComponent(shareUrl)}`
                break
            case "facebook":
                shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
                break
        }

        if (shareLink) {
            window.open(shareLink, "_blank")
        }
    }

    return (
        <div className="flex justify-center space-x-4 mt-4">
            <button onClick={() => handleShare("twitter")} className="p-3 rounded-full bg-purple-900/60 hover:bg-purple-800/60 transition-colors duration-300 box-glow-blue" aria-label="Share on Twitter"><Twitter size={20} className="text-blue-400" /></button>
            <button onClick={() => handleShare("facebook")} className="p-3 rounded-full bg-purple-900/60 hover:bg-purple-800/60 transition-colors duration-300 box-glow-blue" aria-label="Share on Facebook"><Facebook size={20} className="text-blue-600" /></button>
            <button onClick={handleCopyLink} className="p-3 rounded-full bg-purple-900/60 hover:bg-purple-800/60 transition-colors duration-300 box-glow-pink" aria-label="Copy link"><LinkIcon size={20} className="text-pink-400" /></button>
            {copied && <div className="absolute mt-12 bg-purple-900 text-white px-3 py-1 rounded text-sm">Link copied!</div>}
        </div>
    )
}
import { Music } from "lucide-react"

interface LoadingOverlayProps {
    message?: string
}

export function LoadingOverlay({ message = "Loading..." }: LoadingOverlayProps) {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center box-glow-pink pulse mb-4 mx-auto"><Music size={32} className="text-white" /></div>
                <h1 className="text-2xl font-bold text-glow-pink mb-2">{message}</h1>
                <p className="text-purple-200">Please wait...</p>
                <div className="mt-4"><div className="w-8 h-8 border-2 border-pink-400 border-t-transparent rounded-full animate-spin mx-auto"></div></div>
            </div>
        </div>
    )
}
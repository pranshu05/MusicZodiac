"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Music, BarChart2, Users } from "lucide-react"
import { ROUTES } from "@/utils/constants"

export function Navigation() {
    const pathname = usePathname()

    const navItems = [
        {
            name: "Explore",
            href: ROUTES.HOME,
            icon: <Music size={24} />,
        },
        {
            name: "Chart",
            href: ROUTES.CHART,
            icon: <BarChart2 size={24} />,
        },
        {
            name: "Friends",
            href: "/friends",
            icon: <Users size={24} />,
        }
    ]

    return (
        <nav className="z-10 bg-gradient-to-r from-purple-900/90 to-fuchsia-900/90 backdrop-blur-md border-t border-purple-500/20">
            <div className="container mx-auto px-4">
                <div className="flex justify-around">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
                        return (
                            <Link key={item.name} href={item.href} className={`flex flex-col items-center py-3 px-4 transition-all duration-300 ${isActive ? "text-pink-400 text-glow-pink" : "text-gray-300 hover:text-pink-300"}`}>
                                <div className={`${isActive ? "scale-110" : "scale-100"} transition-transform duration-300`}>{item.icon}</div>
                                <span className="text-xs mt-1">{item.name}</span>
                                {isActive && (<div className="absolute bottom-0 w-10 h-1 bg-gradient-to-r from-pink-500 to-purple-500 rounded-t-full box-glow-pink"></div>)}
                            </Link>
                        )
                    })}
                </div>
            </div>
        </nav>
    )
}
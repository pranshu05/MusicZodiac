"use client"
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Music, User, Menu, X } from "lucide-react";
import { useState } from "react";
import { LastfmLogin } from "@/components/auth/lastfm-login";
import { ROUTES } from "@/utils/constants";

export function Header() {
    const { data: session } = useSession();
    const pathname = usePathname();
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <header className="sticky top-0 z-10 bg-gradient-to-r from-indigo-900 to-purple-900 text-white shadow-md">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <Link href={ROUTES.HOME} className="flex items-center space-x-2"><Music size={28} className="text-pink-400" /><span className="text-xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">Music Zodiac</span></Link>
                <nav className="hidden md:flex items-center space-x-6">
                    {session ? (
                        <>
                            <NavLink href={ROUTES.CHART} currentPath={pathname}>My Chart</NavLink>
                            <NavLink href={ROUTES.COMPATIBILITY} currentPath={pathname}>Compatibility</NavLink>
                            <NavLink href={ROUTES.FRIENDS} currentPath={pathname}>Friends</NavLink>
                            <div className="relative group">
                                <div className="flex items-center space-x-2 cursor-pointer">
                                    {session.user.image ? (
                                        <div className="w-8 h-8 rounded-full overflow-hidden"><img src={session.user.image} alt={session.user.name || "User"} width={32} height={32} /></div>
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center"><User size={16} /></div>
                                    )}
                                    <span>{session.user.name}</span>
                                </div>
                                <div className="absolute right-0 mt-2 w-48 bg-purple-800 rounded-md shadow-lg overflow-hidden z-20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                    <div className="py-1">
                                        <Link href={`${ROUTES.PROFILE}/${session.user.username}`} className="block px-4 py-2 text-sm hover:bg-purple-700">Profile</Link>
                                        <button onClick={() => signOut({ callbackUrl: ROUTES.HOME })} className="block w-full text-left px-4 py-2 text-sm hover:bg-purple-700">Sign Out</button>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <LastfmLogin />
                    )}
                </nav>
                <button className="md:hidden text-white" onClick={toggleMenu} aria-label="Toggle menu">{menuOpen ? <X size={24} /> : <Menu size={24} />}</button>
            </div>
            {menuOpen && (
                <div className="md:hidden bg-purple-900 px-4 py-2">
                    <nav className="flex flex-col space-y-2">
                        {session ? (
                            <>
                                <Link href={ROUTES.CHART} className={`px-2 py-2 rounded ${pathname === ROUTES.CHART ? 'bg-purple-800' : 'hover:bg-purple-800'}`} onClick={() => setMenuOpen(false)}>My Chart</Link>
                                <Link href={ROUTES.COMPATIBILITY} className={`px-2 py-2 rounded ${pathname === ROUTES.COMPATIBILITY ? 'bg-purple-800' : 'hover:bg-purple-800'}`} onClick={() => setMenuOpen(false)}>Compatibility</Link>
                                <Link href={ROUTES.FRIENDS} className={`px-2 py-2 rounded ${pathname === ROUTES.FRIENDS ? 'bg-purple-800' : 'hover:bg-purple-800'}`} onClick={() => setMenuOpen(false)}>Friends</Link>
                                <Link href={`${ROUTES.PROFILE}/${session.user.username || session.user.id}`} className={`px-2 py-2 rounded ${pathname.startsWith(ROUTES.PROFILE) ? 'bg-purple-800' : 'hover:bg-purple-800'}`} onClick={() => setMenuOpen(false)}>Profile</Link>
                                <button onClick={() => { signOut({ callbackUrl: ROUTES.HOME }); setMenuOpen(false); }} className="px-2 py-2 text-left rounded hover:bg-purple-800">Sign Out</button>
                            </>
                        ) : (
                            <div className="px-2 py-2">
                                <LastfmLogin className="w-full" />
                            </div>
                        )}
                    </nav>
                </div>
            )}
        </header>
    );
}

interface NavLinkProps {
    href: string;
    currentPath: string;
    children: React.ReactNode;
}

function NavLink({ href, currentPath, children }: NavLinkProps) {
    const isActive = currentPath === href || currentPath.startsWith(`${href}/`);

    return (<Link href={href} className={`transition-colors duration-200 hover:text-pink-300 ${isActive ? 'text-pink-400 font-medium' : 'text-white'}`}>{children}</Link>);
}
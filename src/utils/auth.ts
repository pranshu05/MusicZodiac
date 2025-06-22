import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import crypto from "crypto"

interface LastFmUser {
    name: string
    realname?: string
    image?: Array<{ "#text": string; size: string }>
    url?: string
}

// Generate API signature for Last.fm
function generateSignature(params: Record<string, string>, secret: string): string {
    const sortedKeys = Object.keys(params).sort()
    const paramString = sortedKeys.map((key) => `${key}${params[key]}`).join("")
    return crypto
        .createHash("md5")
        .update(paramString + secret)
        .digest("hex")
}

// Get Last.fm session key
async function getLastFmSession(token: string): Promise<{ key: string; name: string } | null> {
    const params = {
        method: "auth.getSession",
        api_key: process.env.LASTFM_CLIENT_ID!,
        token: token,
    }

    const signature = generateSignature(params, process.env.LASTFM_CLIENT_SECRET!)

    const url = new URL("https://ws.audioscrobbler.com/2.0/")
    Object.entries(params).forEach(([key, value]) => url.searchParams.append(key, value))
    url.searchParams.append("api_sig", signature)
    url.searchParams.append("format", "json")

    console.log("Requesting Last.fm session with URL:", url.toString())

    try {
        const response = await fetch(url.toString())
        const data = await response.json()

        console.log("Last.fm session response:", data)

        if (data.session) {
            return {
                key: data.session.key,
                name: data.session.name,
            }
        }

        if (data.error) {
            console.error("Last.fm API error:", data.message)
            throw new Error(`Last.fm API error: ${data.message}`)
        }

        return null
    } catch (error) {
        console.error("Error getting Last.fm session:", error)
        throw error
    }
}

// Get Last.fm user info
async function getLastFmUser(username: string): Promise<LastFmUser | null> {
    const params = {
        method: "user.getInfo",
        api_key: process.env.LASTFM_CLIENT_ID!,
        user: username,
    }

    const url = new URL("https://ws.audioscrobbler.com/2.0/")
    Object.entries(params).forEach(([key, value]) => url.searchParams.append(key, value))
    url.searchParams.append("format", "json")

    try {
        const response = await fetch(url.toString())
        const data = await response.json()

        console.log("Last.fm user info response:", data)

        if (data.user) {
            return data.user
        }
        return null
    } catch (error) {
        console.error("Error getting Last.fm user info:", error)
        return null
    }
}

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "lastfm",
            name: "Last.fm",
            credentials: {
                token: { label: "Token", type: "text" },
            },
            async authorize(credentials) {
                console.log("=== Last.fm Authorization Started ===")
                console.log("Token received:", credentials?.token)

                if (!credentials?.token) {
                    console.log("No token provided")
                    throw new Error("No token provided")
                }

                try {
                    console.log("Getting Last.fm session...")
                    const session = await getLastFmSession(credentials.token)

                    if (!session) {
                        console.log("Failed to get Last.fm session")
                        throw new Error("Failed to get Last.fm session")
                    }

                    console.log("Got Last.fm session:", session)

                    console.log("Getting Last.fm user info...")
                    const userInfo = await getLastFmUser(session.name)

                    if (!userInfo) {
                        console.log("Failed to get Last.fm user info")
                        throw new Error("Failed to get Last.fm user info")
                    }

                    console.log("Got Last.fm user info:", userInfo)

                    const imageUrl =
                        userInfo.image?.find((img) => img.size === "large")?.["#text"] ||
                        userInfo.image?.find((img) => img.size === "medium")?.["#text"] ||
                        null

                    const user = {
                        id: session.name,
                        name: userInfo.realname || userInfo.name,
                        email: null,
                        image: imageUrl,
                        username: session.name,
                        sessionKey: session.key,
                    }

                    console.log("=== Authorization Successful ===")
                    console.log("Returning user:", user)
                    return user
                } catch (error) {
                    console.error("=== Authorization Failed ===")
                    console.error("Last.fm authorization error:", error)
                    throw error
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                console.log("JWT callback - storing user data")
                token.sessionKey = (user as any).sessionKey
                token.user = {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    image: user.image,
                    username: (user as any).username,
                }
            }
            return token
        },

        async session({ session, token }) {
            if (token.user) {
                session.user = {
                    ...session.user,
                    id: token.user.id,
                    username: token.user.username,
                }
            }
            session.sessionKey = token.sessionKey
            return session
        },

        async signIn({ user }) {
            console.log("=== SignIn Callback Started ===")
            console.log("User data:", user)

            if (!user.id) {
                console.log("No user ID provided")
                return false
            }

            try {
                let existingUser = await prisma.user.findUnique({
                    where: { id: user.id },
                })

                if (!existingUser) {
                    console.log("Creating new user:", user.id)
                    existingUser = await prisma.user.create({
                        data: {
                            id: user.id,
                            name: user.name,
                            image: user.image,
                            username: (user as any).username,
                            accounts: {
                                create: {
                                    type: "oauth",
                                    provider: "lastfm",
                                    providerAccountId: user.id,
                                    access_token: (user as any).sessionKey,
                                },
                            },
                        },
                    })
                    console.log("Created user:", existingUser)
                } else {
                    console.log("Updating existing user:", user.id)
                    await prisma.user.update({
                        where: { id: user.id },
                        data: {
                            name: user.name || existingUser.name,
                            image: user.image || existingUser.image,
                        },
                    })

                    const existingAccount = await prisma.account.findFirst({
                        where: {
                            userId: user.id,
                            provider: "lastfm",
                        },
                    })

                    if (!existingAccount) {
                        console.log("Creating new account for existing user")
                        await prisma.account.create({
                            data: {
                                type: "oauth",
                                provider: "lastfm",
                                providerAccountId: user.id,
                                access_token: (user as any).sessionKey,
                                userId: user.id,
                            },
                        })
                    } else {
                        console.log("Updating existing account")
                        await prisma.account.update({
                            where: { id: existingAccount.id },
                            data: {
                                access_token: (user as any).sessionKey,
                            },
                        })
                    }
                }

                console.log("=== SignIn Callback Successful ===")
                return true
            } catch (error) {
                console.error("=== SignIn Callback Failed ===")
                console.error("Sign-in error:", error)
                return false
            }
        },
    },
    pages: {
        signIn: "/",
        error: "/error",
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV === "development",
}

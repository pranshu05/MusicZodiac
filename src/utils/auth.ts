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

function generateSignature(params: Record<string, string>, secret: string): string {
    const sortedKeys = Object.keys(params).sort()
    const paramString = sortedKeys.map((key) => `${key}${params[key]}`).join("")
    return crypto
        .createHash("md5")
        .update(paramString + secret)
        .digest("hex")
}

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

    try {
        const response = await fetch(url.toString())
        const data = await response.json()

        if (data.session) {
            return {
                key: data.session.key,
                name: data.session.name,
            }
        }

        if (data.error) {
            throw new Error(`Last.fm API error: ${data.message}`)
        }

        return null
    } catch (error) {
        throw error
    }
}

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

        if (data.user) {
            return data.user
        }

        return null
    } catch (error) {
        return null
    }
}

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "lastfm",
            name: "Last.fm",
            credentials: { token: { label: "Token", type: "text" }, },

            async authorize(credentials) {
                if (!credentials?.token) {
                    throw new Error("No token provided")
                }

                try {
                    const session = await getLastFmSession(credentials.token)

                    if (!session) {
                        throw new Error("Failed to get Last.fm session")
                    }

                    const userInfo = await getLastFmUser(session.name)

                    if (!userInfo) {
                        throw new Error("Failed to get Last.fm user info")
                    }

                    const imageUrl = userInfo.image?.find((img) => img.size === "large")?.["#text"] || userInfo.image?.find((img) => img.size === "medium")?.["#text"] || null

                    const user = {
                        id: session.name,
                        name: userInfo.realname || userInfo.name,
                        image: imageUrl,
                        username: session.name,
                        sessionKey: session.key,
                    }

                    return user
                } catch (error) {
                    throw error
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.sessionKey = (user as any).sessionKey
                token.user = {
                    id: user.id,
                    name: user.name,
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
            if (!user.id) {
                return false
            }

            try {
                let existingUser = await prisma.user.findUnique({ where: { id: user.id }, })

                if (!existingUser) {
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
                } else {
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
                        await prisma.account.update({
                            where: { id: existingAccount.id },
                            data: {
                                access_token: (user as any).sessionKey,
                            },
                        })
                    }
                }

                return true
            } catch (error) {
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
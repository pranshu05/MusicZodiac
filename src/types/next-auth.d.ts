import type { DefaultSession } from "next-auth"

declare module "next-auth" {
    interface Session {
        user: {
            id: string
            name?: string | null
            image?: string | null
            username?: string | null
        } & DefaultSession["user"]
        sessionKey?: string
        error?: string
    }

    interface User {
        id: string
        name?: string | null
        image?: string | null
        username?: string | null
        sessionKey?: string
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        user?: {
            id: string
            name?: string | null
            image?: string | null
            username?: string | null
        }
        sessionKey?: string
        error?: string
    }
}
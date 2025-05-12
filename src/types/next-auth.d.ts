import { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            name?: string | null;
            email?: string | null;
            image?: string | null;
            username?: string | null;
        } & DefaultSession["user"];
        accessToken?: string;
        refreshToken?: string;
        accessTokenExpires?: number;
        error?: string;
    }

    interface User {
        id: string;
        name?: string | null;
        email?: string | null;
        image?: string | null;
        username?: string | null;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        user?: {
            id: string;
            name?: string | null;
            email?: string | null;
            image?: string | null;
            username?: string | null;
        };
        accessToken?: string;
        refreshToken?: string;
        accessTokenExpires?: number;
        error?: string;
    }
}
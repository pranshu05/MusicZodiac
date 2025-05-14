import type { NextAuthOptions } from 'next-auth';
import SpotifyProvider from 'next-auth/providers/spotify';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '@/lib/prisma';

interface SpotifyProfile {
    id: string;
    email: string;
    name?: string;
    display_name?: string;
    images?: Array<{ url: string }>;
    picture?: string;
    avatar_url?: string;
}

const scopes = [
    'user-read-email',
    'user-read-private',
    'user-top-read',
    'user-read-recently-played',
    'user-library-read',
].join(' ');

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        SpotifyProvider({
            clientId: process.env.SPOTIFY_CLIENT_ID!,
            clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
            authorization: { params: { scope: scopes }, },
        }),
    ],
    callbacks: {
        async jwt({ token, account, user }) {
            if (account && user) {
                token.accessToken = account.access_token;
                token.refreshToken = account.refresh_token;
                token.accessTokenExpires = account.expires_at ? account.expires_at * 1000 : 0;
                token.user = {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    image: user.image,
                    username: user.username,
                };
            }
            return token;
        },

        async session({ session, token }) {
            if (token.user) {
                session.user = {
                    ...session.user,
                    id: token.user.id,
                    username: token.user.username,
                };
            }
            session.accessToken = token.accessToken;
            session.error = token.error;
            return session;
        },

        async signIn({ profile, account }) {
            if (!profile?.email || !account) return false;

            const spotifyProfile = profile as SpotifyProfile;
            const imageUrl = spotifyProfile.images?.[0]?.url || spotifyProfile.picture || spotifyProfile.avatar_url || null;
            const spotifyId = spotifyProfile.id;

            try {
                let user = await prisma.user.findUnique({ where: { id: spotifyId } });

                if (!user) {
                    user = await prisma.user.create({
                        data: {
                            id: spotifyId,
                            email: spotifyProfile.email,
                            name: spotifyProfile.name || spotifyProfile.display_name || 'Spotify User',
                            image: imageUrl,
                            username: `user_${Math.random().toString(36).substring(2, 10)}`,
                            accounts: {
                                create: {
                                    id: spotifyId,
                                    type: account.type,
                                    provider: account.provider,
                                    providerAccountId: account.providerAccountId,
                                    refresh_token: account.refresh_token,
                                    access_token: account.access_token,
                                    expires_at: account.expires_at,
                                    token_type: account.token_type,
                                    scope: account.scope,
                                },
                            },
                        },
                    });
                } else {
                    await prisma.user.update({
                        where: { id: spotifyId },
                        data: {
                            email: spotifyProfile.email,
                            name: spotifyProfile.name || spotifyProfile.display_name || user.name,
                            image: imageUrl || user.image,
                        },
                    });

                    const existingAccount = await prisma.account.findUnique({
                        where: { id: spotifyId },
                    });

                    if (!existingAccount) {
                        await prisma.account.create({
                            data: {
                                id: spotifyId,
                                type: account.type,
                                provider: account.provider,
                                providerAccountId: account.providerAccountId,
                                refresh_token: account.refresh_token,
                                access_token: account.access_token,
                                expires_at: account.expires_at,
                                token_type: account.token_type,
                                scope: account.scope,
                                user: { connect: { id: spotifyId }, },
                            },
                        });
                    } else {
                        await prisma.account.update({
                            where: { id: spotifyId },
                            data: {
                                refresh_token: account.refresh_token,
                                access_token: account.access_token,
                                expires_at: account.expires_at,
                                token_type: account.token_type,
                                scope: account.scope,
                            },
                        });
                    }
                }

                if (!user.username) {
                    await prisma.user.update({
                        where: { id: spotifyId },
                        data: { username: `user_${Math.random().toString(36).substring(2, 10)}`, },
                    });
                }

                return true;
            } catch (error) {
                console.error('Sign-in error:', error);
                return false;
            }
        },
    },
    pages: {
        signIn: '/',
        error: '/error',
    },
    session: {
        strategy: 'jwt',
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV === 'development',
};
/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
        LASTFM_CLIENT_ID: process.env.LASTFM_CLIENT_ID,
        LASTFM_CLIENT_SECRET: process.env.LASTFM_CLIENT_SECRET,
        DATABASE_URL: process.env.DATABASE_URL,
    }
};

export default nextConfig;
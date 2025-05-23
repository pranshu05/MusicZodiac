import { prisma } from "@/lib/prisma";
import { getSpotifyData } from "@/lib/spotify";
import type { User } from "@prisma/client";

type OptimizedArtist = {
    id: string;
    name: string;
    image?: string;
};

type OptimizedChartData = {
    [key: string]: {
        sign: string;
        artists: OptimizedArtist[];
    };
};

function optimizeChartData(fullChartData: any): OptimizedChartData {
    try {
        if (!fullChartData) {
            return {};
        }

        const optimizedData: OptimizedChartData = {};

        Object.keys(fullChartData).forEach(key => {
            const signData = fullChartData[key];

            if (signData && signData.artists && Array.isArray(signData.artists)) {
                optimizedData[key] = {
                    sign: signData.sign || '',
                    artists: signData.artists.map((artist: any) => {
                        const optimizedArtist: OptimizedArtist = {
                            id: artist.id || '',
                            name: artist.name || ''
                        };

                        if (artist.images && artist.images.length > 0) {
                            optimizedArtist.image = artist.images[0].url;
                        }

                        return optimizedArtist;
                    })
                };
            }
        });

        return optimizedData;
    } catch (error) {
        console.error('Error optimizing chart data:', error);
        return {};
    }
}

export async function generateAndSaveChart(user: User) {
    try {
        if (!user.id) {
            throw new Error("User ID is required");
        }

        const account = await prisma.account.findFirst({
            where: {
                userId: user.id,
                provider: 'spotify'
            }
        });

        if (account && account.refresh_token) {
            const isTokenExpired = !account.access_token || (account.expires_at && account.expires_at * 1000 < Date.now());

            if (isTokenExpired) {
                try {
                    const clientId = process.env.SPOTIFY_CLIENT_ID;
                    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

                    const response = await fetch('https://accounts.spotify.com/api/token', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
                        },
                        body: new URLSearchParams({
                            grant_type: 'refresh_token',
                            refresh_token: account.refresh_token
                        })
                    });

                    const data = await response.json();

                    if (data.access_token) {
                        await prisma.account.update({
                            where: { id: account.id },
                            data: {
                                access_token: data.access_token,
                                expires_at: Math.floor(Date.now() / 1000 + (data.expires_in || 3600)),
                                ...(data.refresh_token && { refresh_token: data.refresh_token })
                            }
                        });

                        account.access_token = data.access_token;
                    }
                } catch (refreshError) {
                    console.error('Failed to refresh token:', refreshError);
                }
            }
        }

        if (!account || !account.access_token) {
            throw new Error("Spotify account or access token not found");
        }

        const spotifyToken = account.access_token;
        const fullChartData = await getSpotifyData(spotifyToken);

        if (!fullChartData) {
            throw new Error("Failed to generate chart data");
        }

        const optimizedChartData = optimizeChartData(fullChartData);

        const existingChart = await prisma.musicChart.findUnique({
            where: {
                userId: user.id
            }
        });

        let result;

        if (existingChart) {
            result = await prisma.musicChart.update({
                where: {
                    userId: user.id
                },
                data: {
                    chartData: optimizedChartData as any,
                    updatedAt: new Date()
                }
            });
        } else {
            result = await prisma.musicChart.create({
                data: {
                    userId: user.id,
                    chartData: optimizedChartData as any,
                    generatedAt: new Date()
                }
            });
        }

        return result;
    } catch (error) {
        console.error(`Error generating chart for user ${user.id}:`, error);
        throw error;
    }
}
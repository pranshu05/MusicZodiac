import { prisma } from "@/lib/prisma";
import { getSpotifyData } from "@/lib/spotify";
import type { User } from "@prisma/client";

export async function generateAndSaveChart(user: User) {
    try {
        if (!user.id) {
            throw new Error("User ID is required");
        }

        const spotifyToken = ""; 
        const chartData = await getSpotifyData(spotifyToken);

        if (!chartData) {
            throw new Error("Failed to generate chart data");
        }

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
                    chartData: chartData as any,
                    updatedAt: new Date()
                }
            });
        } else {
            result = await prisma.musicChart.create({
                data: {
                    userId: user.id,
                    chartData: chartData as any,
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
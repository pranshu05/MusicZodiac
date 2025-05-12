import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateAndSaveChart } from "@/utils/generate-chart";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    
    try {
        const batchSize = 100;
        let skip = 0;
        let users: any[] = [];
        let processedCount = 0;

        do {
            users = await prisma.user.findMany({
                skip,
                take: batchSize,
                select: { id: true }
            });

            const results = await Promise.allSettled(
                users.map(user => generateAndSaveChart(user))
            );

            processedCount += results.filter(
                result => result.status === "fulfilled"
            ).length;

            skip += batchSize;
        } while (users.length === batchSize);

        return NextResponse.json({
            success: true,
            message: `Successfully processed ${processedCount} users`
        });
    } catch (error) {
        console.error("Error updating charts:", error);
        return NextResponse.json(
            { error: "Failed to update charts" },
            { status: 500 }
        );
    }
}
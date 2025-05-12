import { NextResponse, NextRequest } from "next/server"
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { friendId } = await req.json()

        if (!friendId) {
            return NextResponse.json({ error: "Friend ID is required" }, { status: 400 })
        }

        const existingRequest = await prisma.friend.findFirst({
            where: {
                OR: [
                    { userId: session.user.id, friendId },
                    { userId: friendId, friendId: session.user.id },
                ],
            },
        })

        if (existingRequest) {
            return NextResponse.json({ error: "Friend request already exists" }, { status: 400 })
        }

        const friendRequest = await prisma.friend.create({
            data: {
                userId: session.user.id,
                friendId,
                status: "pending",
            },
        })

        return NextResponse.json({ success: true, friendRequest })
    } catch (error) {
        console.error("Error sending friend request:", error)
        return NextResponse.json({ error: "Failed to send friend request" }, { status: 500 })
    }
}
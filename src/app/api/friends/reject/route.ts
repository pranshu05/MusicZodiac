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

        const { requestId } = await req.json()

        if (!requestId) {
            return NextResponse.json({ error: "Request ID is required" }, { status: 400 })
        }

        const friendRequest = await prisma.friend.findUnique({
            where: {
                id: requestId,
            },
        })

        if (!friendRequest) {
            return NextResponse.json({ error: "Friend request not found" }, { status: 404 })
        }

        if (friendRequest.friendId !== session.user.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        await prisma.friend.delete({
            where: {
                id: requestId,
            },
        })

        return NextResponse.json({ success: true })
    } catch {
        return NextResponse.json({ error: "Failed to reject friend request" }, { status: 500 })
    }
}
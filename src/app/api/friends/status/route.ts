import { NextResponse, type NextRequest } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/utils/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { searchParams } = new URL(req.url)
        const targetUserId = searchParams.get("userId")

        if (!targetUserId) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 })
        }

        const friendship = await prisma.friend.findFirst({
            where: {
                OR: [
                    { userId: session.user.id, friendId: targetUserId },
                    { userId: targetUserId, friendId: session.user.id },
                ],
            },
        })

        if (!friendship) {
            return NextResponse.json({ status: "none" })
        }

        let status = "none"

        if (friendship.status === "accepted") {
            status = "accepted"
        } else if (friendship.status === "pending") {
            if (friendship.userId === session.user.id) {
                status = "sent"
            } else {
                status = "pending"
            }
        }

        return NextResponse.json({ status, requestId: friendship.id, })
    } catch {
        return NextResponse.json({ error: "Failed to check friendship status" }, { status: 500 })
    }
}

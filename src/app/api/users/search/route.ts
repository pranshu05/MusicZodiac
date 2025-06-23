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
        const query = searchParams.get("q")

        if (!query || query.trim().length < 2) {
            return NextResponse.json({ error: "Search query must be at least 2 characters" }, { status: 400 })
        }

        const users = await prisma.user.findMany({
            where: {
                AND: [
                    {
                        id: {
                            not: session.user.id,
                        },
                    },
                    {
                        OR: [
                            {
                                username: {
                                    contains: query,
                                    mode: "insensitive",
                                },
                            },
                            {
                                name: {
                                    contains: query,
                                    mode: "insensitive",
                                },
                            },
                        ],
                    },
                ],
            },
            select: {
                id: true,
                name: true,
                username: true,
                image: true,
                createdAt: true,
            },
            take: 10,
            orderBy: [
                {
                    username: "asc",
                },
                {
                    name: "asc",
                },
            ],
        })

        const userIds = users.map((user) => user.id)
        const friendships = await prisma.friend.findMany({
            where: {
                OR: [
                    { userId: session.user.id, friendId: { in: userIds } },
                    { userId: { in: userIds }, friendId: session.user.id },
                ],
            },
            select: {
                id: true,
                userId: true,
                friendId: true,
                status: true,
            },
        })

        const usersWithStatus = users.map((user) => {
            const friendship = friendships.find(
                (f) =>
                    (f.userId === session.user.id && f.friendId === user.id) ||
                    (f.userId === user.id && f.friendId === session.user.id),
            )

            let friendshipStatus = "none"
            let requestId = null

            if (friendship) {
                requestId = friendship.id
                if (friendship.status === "accepted") {
                    friendshipStatus = "accepted"
                } else if (friendship.status === "pending") {
                    if (friendship.userId === session.user.id) {
                        friendshipStatus = "sent"
                    } else {
                        friendshipStatus = "pending"
                    }
                }
            }

            return {
                ...user,
                friendshipStatus,
                requestId,
            }
        })

        return NextResponse.json({ users: usersWithStatus })
    } catch (error) {
        return NextResponse.json({ error: "Failed to search users" }, { status: 500 })
    }
}
import { NextResponse, NextRequest } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/utils/auth"
import { prisma } from "@/lib/prisma"

export async function PUT(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { name, username } = await req.json()

        if (!name || !username) {
            return NextResponse.json(
                { error: "Name and username are required" },
                { status: 400 }
            )
        }

        const existingUser = await prisma.user.findFirst({
            where: {
                username,
                NOT: {
                    id: session.user.id
                }
            }
        })

        if (existingUser) {
            return NextResponse.json(
                { error: "Username is already taken" },
                { status: 400 }
            )
        }

        const updatedUser = await prisma.user.update({
            where: {
                id: session.user.id
            },
            data: {
                name,
                username
            },
            select: {
                id: true,
                name: true,
                username: true,
                email: true,
                image: true
            }
        })

        return NextResponse.json({
            success: true,
            user: updatedUser
        })
    } catch (error) {
        console.error("Error updating profile:", error)
        return NextResponse.json(
            { error: "Failed to update profile" },
            { status: 500 }
        )
    }
}
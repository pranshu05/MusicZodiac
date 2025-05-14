import { authOptions } from "@/utils/auth";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { ROUTES } from "@/utils/constants"
import { FriendsList } from "@/components/friends/friends-list"
import { FriendRequests } from "@/components/friends/friend-requests"
import { FindFriends } from "@/components/friends/find-friends"

export default async function FriendsPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect(ROUTES.HOME)
    }

    const friendRequests = await prisma.friend.findMany({
        where: {
            friendId: session.user.id,
            status: "pending",
        },
        include: {
            user: true,
        },
    })

    const friends = await prisma.friend.findMany({
        where: {
            OR: [
                { userId: session.user.id, status: "accepted" },
                { friendId: session.user.id, status: "accepted" },
            ],
        },
        include: {
            user: true,
            friend: true,
        },
    })

    const friendsData = friends.map((friendship: { userId: string; user: any; friend: any }) => {
        if (friendship.userId === session.user.id) {
            return friendship.friend
        }

        return friendship.user
    })

    const potentialFriends = await prisma.user.findMany({
        where: {
            id: {
                not: session.user.id,
            },
            NOT: {
                OR: [
                    {
                        friendsOf: {
                            some: {
                                userId: session.user.id,
                            },
                        },
                    },
                    {
                        friends: {
                            some: {
                                friendId: session.user.id,
                            },
                        },
                    },
                ],
            },
            musicChart: {
                isNot: null,
            },
        },
        take: 10,
    })

    return (
        <div className="mx-auto px-4 py-8 space-y-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-center mb-8 text-glow-pink">Friends</h1>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
                    <div className="space-y-8 h-full">
                        {friendRequests.length > 0 && <FriendRequests requests={friendRequests} />}
                        <FriendsList friends={friendsData} />
                    </div>
                    <div className="h-full"><FindFriends potentialFriends={potentialFriends} /></div>
                </div>
            </div>
        </div>
    )
}
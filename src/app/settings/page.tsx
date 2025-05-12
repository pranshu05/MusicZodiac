import { authOptions } from "@/utils/auth";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { ROUTES } from "@/utils/constants"
import { ProfileSettings } from "@/components/settings/profile-settings"

export default async function SettingsPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect(ROUTES.HOME)
    }

    const user = await prisma.user.findUnique({
        where: {
            id: session.user.id,
        },
    })

    if (!user) {
        throw new Error("User not found")
    }

    return (
        <div className="mx-auto px-4 py-8 space-y-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-center mb-8 text-glow-pink">Settings</h1>
                <ProfileSettings user={user} />
            </div>
        </div>
    )
}
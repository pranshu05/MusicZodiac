import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get("token")

    if (!token) {
        return NextResponse.redirect(new URL("/error?error=NoToken", request.url))
    }

    try {
        const signinUrl = new URL("/auth/lastfm-signin", request.url)
        signinUrl.searchParams.set("token", token)

        return NextResponse.redirect(signinUrl)
    } catch (error) {
        return NextResponse.redirect(new URL("/error?error=CallbackError", request.url))
    }
}
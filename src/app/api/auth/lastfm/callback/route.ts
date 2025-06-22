import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get("token")

    if (!token) {
        console.log("No token received in callback")
        return NextResponse.redirect(new URL("/error?error=NoToken", request.url))
    }

    try {
        const signinUrl = new URL("/auth/lastfm-signin", request.url)
        signinUrl.searchParams.set("token", token)

        return NextResponse.redirect(signinUrl)
    } catch (error) {
        console.error("Last.fm callback error:", error)
        return NextResponse.redirect(new URL("/error?error=CallbackError", request.url))
    }
}
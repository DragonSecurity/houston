import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// Get all active sessions
export async function GET() {
	try {
		const session = await getServerSession(authOptions)

		if (!session?.user?.email) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
		}

		// Get all active sessions for the user
		const sessions = await prisma.session.findMany({
			where: {
				userId: session.user.id,
			},
			orderBy: {
				expires: "desc",
			},
		})

		// Format the sessions for the frontend
		const formattedSessions = sessions.map((s) => {
			// Parse user agent to determine device type
			const userAgent = s.userAgent || ""
			let deviceType = "unknown"
			let device = "Unknown Device"
			let browser = "Unknown Browser"

			if (userAgent.includes("iPhone") || userAgent.includes("iPad") || userAgent.includes("Android")) {
				deviceType = "mobile"
				if (userAgent.includes("iPhone")) device = "iPhone"
				else if (userAgent.includes("iPad")) device = "iPad"
				else if (userAgent.includes("Android")) device = "Android Device"
			} else if (userAgent.includes("Windows") || userAgent.includes("Mac") || userAgent.includes("Linux")) {
				deviceType = "desktop"
				if (userAgent.includes("Windows")) device = "Windows PC"
				else if (userAgent.includes("Mac")) device = "Mac"
				else if (userAgent.includes("Linux")) device = "Linux"
			}

			if (userAgent.includes("Chrome")) browser = "Chrome"
			else if (userAgent.includes("Firefox")) browser = "Firefox"
			else if (userAgent.includes("Safari")) browser = "Safari"
			else if (userAgent.includes("Edge")) browser = "Edge"

			// Determine if this is the current session
			const isCurrentSession = s.sessionToken === session.user.id // This is a simplification, in reality you'd need to compare with the actual session token

			return {
				id: s.id,
				device,
				browser,
				location: "Unknown Location", // Would require IP geolocation service
				ip: "Unknown IP", // Would require storing IP with session
				lastActive: new Date(s.updatedAt).toISOString(),
				isCurrent: isCurrentSession,
				deviceType,
				expires: new Date(s.expires).toISOString(),
			}
		})

		return NextResponse.json({ sessions: formattedSessions })
	} catch (error) {
		console.error("Error fetching sessions:", error)
		return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
	}
}

// Revoke a specific session
export async function DELETE(request: Request) {
	try {
		const session = await getServerSession(authOptions)

		if (!session?.user?.email) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
		}

		const { searchParams } = new URL(request.url)
		const sessionId = searchParams.get("id")

		if (!sessionId) {
			return NextResponse.json({ error: "Session ID is required" }, { status: 400 })
		}

		// Verify the session belongs to the user
		const sessionToRevoke = await prisma.session.findUnique({
			where: {
				id: sessionId,
			},
			select: {
				userId: true,
			},
		})

		if (!sessionToRevoke || sessionToRevoke.userId !== session.user.id) {
			return NextResponse.json({ error: "Session not found or not authorized" }, { status: 404 })
		}

		// Delete the session
		await prisma.session.delete({
			where: {
				id: sessionId,
			},
		})

		return NextResponse.json({ success: true })
	} catch (error) {
		console.error("Error revoking session:", error)
		return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
	}
}

// Revoke all sessions except the current one
export async function PATCH() {
	try {
		const session = await getServerSession(authOptions)

		if (!session?.user?.email) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
		}

		// Delete all sessions except the current one
		// This is a simplification - in reality, you'd need to identify the current session token
		await prisma.session.deleteMany({
			where: {
				userId: session.user.id,
				NOT: {
					id: session.user.id, // This is a placeholder, you'd use the actual session token
				},
			},
		})

		return NextResponse.json({ success: true })
	} catch (error) {
		console.error("Error revoking all sessions:", error)
		return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
	}
}


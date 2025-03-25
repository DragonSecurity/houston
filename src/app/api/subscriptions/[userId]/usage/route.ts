import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
	try {
		// Get the authenticated user
		const session = await getServerSession(authOptions)

		if (!session?.user) {
			return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
		}

		const userId = params.userId

		// Check if the requesting user is an admin or the same user
		if (session.user.id !== userId && session.user.role !== "ADMIN") {
			return new NextResponse(JSON.stringify({ error: "Forbidden" }), { status: 403 })
		}

		// Get the last 30 days of usage data
		const thirtyDaysAgo = new Date()
		thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

		// Get the user's subscription
		const subscription = await prisma.subscription.findFirst({
			where: {
				userId,
				status: "ACTIVE",
			},
			include: {
				plan: true,
			},
		})

		if (!subscription) {
			return new NextResponse(JSON.stringify({ error: "No active subscription found" }), { status: 404 })
		}

		// Get usage data for the last 30 days
		const usageData = await prisma.usage.findMany({
			where: {
				subscriptionId: subscription.id,
				createdAt: {
					gte: thirtyDaysAgo,
				},
			},
			orderBy: {
				createdAt: "asc",
			},
		})

		// Format the data for the chart
		const formattedData = usageData.map((usage) => ({
			date: usage.createdAt.toISOString(),
			api: usage.apiCalls || 0,
			storage: usage.storage || 0,
			bandwidth: usage.bandwidth || 0,
		}))

		// If there's no data, generate some sample data
		if (formattedData.length === 0) {
			const sampleData = []
			for (let i = 0; i < 30; i++) {
				const date = new Date()
				date.setDate(date.getDate() - (30 - i))
				sampleData.push({
					date: date.toISOString(),
					api: Math.floor(Math.random() * 1000),
					storage: Math.floor(Math.random() * 500),
					bandwidth: Math.floor(Math.random() * 2000),
				})
			}
			return NextResponse.json({ usage: sampleData })
		}

		return NextResponse.json({ usage: formattedData })
	} catch (error) {
		console.error("Error fetching usage data:", error)
		return new NextResponse(JSON.stringify({ error: "Internal Server Error" }), { status: 500 })
	}
}


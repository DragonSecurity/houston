import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
	try {
		// Get the authenticated user
		const session = await getServerSession(authOptions)

		if (!session?.user) {
			return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
		}

		// Check if user is an admin
		const user = await prisma.user.findUnique({
			where: { id: session.user.id },
			select: { role: true },
		})

		if (user?.role !== "ADMIN") {
			return new NextResponse(JSON.stringify({ error: "Forbidden" }), { status: 403 })
		}

		// Get the last 30 days of user growth data
		const thirtyDaysAgo = new Date()
		thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

		// Get all users created in the last 30 days
		const users = await prisma.user.findMany({
			where: {
				createdAt: {
					gte: thirtyDaysAgo,
				},
			},
			select: {
				id: true,
				createdAt: true,
			},
			orderBy: {
				createdAt: "asc",
			},
		})

		// Group users by day
		const usersByDay: Record<string, { newUsers: number; totalUsers: number }> = {}

		// Initialize the data structure for the last 30 days
		for (let i = 0; i < 30; i++) {
			const date = new Date(thirtyDaysAgo)
			date.setDate(date.getDate() + i)
			const dayKey = date.toISOString().split("T")[0] // YYYY-MM-DD format

			usersByDay[dayKey] = {
				newUsers: 0,
				totalUsers: 0,
			}
		}

		// Count new users by day
		users.forEach((user) => {
			const dayKey = user.createdAt.toISOString().split("T")[0]

			if (usersByDay[dayKey]) {
				usersByDay[dayKey].newUsers += 1
			}
		})

		// Calculate cumulative total users
		let runningTotal = 0
		// Get total users before the 30-day period
		const existingUsersCount = await prisma.user.count({
			where: {
				createdAt: {
					lt: thirtyDaysAgo,
				},
			},
		})

		runningTotal = existingUsersCount

		// Calculate running total for each day
		Object.keys(usersByDay)
			.sort()
			.forEach((dayKey) => {
				runningTotal += usersByDay[dayKey].newUsers
				usersByDay[dayKey].totalUsers = runningTotal
			})

		// Convert to array format for the chart
		const growthData = Object.entries(usersByDay).map(([date, data]) => ({
			date,
			newUsers: data.newUsers,
			totalUsers: data.totalUsers,
		}))

		return NextResponse.json({ growth: growthData })
	} catch (error) {
		console.error("Error fetching user growth data:", error)
		return new NextResponse(JSON.stringify({ error: "Internal Server Error" }), { status: 500 })
	}
}


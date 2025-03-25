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

		// Get total users
		const totalUsers = await prisma.user.count()

		// Get monthly revenue
		const currentDate = new Date()
		const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
		const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)

		const monthlyRevenue = await prisma.payment.aggregate({
			_sum: {
				amount: true,
			},
			where: {
				createdAt: {
					gte: firstDayOfMonth,
					lte: lastDayOfMonth,
				},
				status: "COMPLETED",
			},
		})

		// Get previous month revenue for comparison
		const firstDayOfPrevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
		const lastDayOfPrevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0)

		const prevMonthlyRevenue = await prisma.payment.aggregate({
			_sum: {
				amount: true,
			},
			where: {
				createdAt: {
					gte: firstDayOfPrevMonth,
					lte: lastDayOfPrevMonth,
				},
				status: "COMPLETED",
			},
		})

		// Get active subscriptions
		const activeSubscriptions = await prisma.subscription.count({
			where: {
				status: "ACTIVE",
			},
		})

		// Get previous month active subscriptions
		const prevMonthActiveSubscriptions = await prisma.subscription.count({
			where: {
				status: "ACTIVE",
				createdAt: {
					lt: firstDayOfMonth,
				},
			},
		})

		// Get average usage
		const usageStats = await prisma.usage.aggregate({
			_avg: {
				amount: true,
			},
			where: {
				createdAt: {
					gte: firstDayOfMonth,
					lte: lastDayOfMonth,
				},
			},
		})

		// Get previous month average usage
		const prevMonthUsageStats = await prisma.usage.aggregate({
			_avg: {
				amount: true,
			},
			where: {
				createdAt: {
					gte: firstDayOfPrevMonth,
					lte: lastDayOfPrevMonth,
				},
			},
		})

		// Calculate percentage changes
		const revenueChange = prevMonthlyRevenue._sum.amount
			? (((monthlyRevenue._sum.amount || 0) - prevMonthlyRevenue._sum.amount) / prevMonthlyRevenue._sum.amount) * 100
			: 0

		const subscriptionsChange = prevMonthActiveSubscriptions
			? ((activeSubscriptions - prevMonthActiveSubscriptions) / prevMonthActiveSubscriptions) * 100
			: 0

		const usageChange = prevMonthUsageStats._avg.amount
			? (((usageStats._avg.amount || 0) - prevMonthUsageStats._avg.amount) / prevMonthUsageStats._avg.amount) * 100
			: 0

		// Get new users this month
		const newUsers = await prisma.user.count({
			where: {
				createdAt: {
					gte: firstDayOfMonth,
					lte: lastDayOfMonth,
				},
			},
		})

		// Get new users last month
		const prevMonthNewUsers = await prisma.user.count({
			where: {
				createdAt: {
					gte: firstDayOfPrevMonth,
					lte: lastDayOfPrevMonth,
				},
			},
		})

		const newUsersChange = prevMonthNewUsers ? ((newUsers - prevMonthNewUsers) / prevMonthNewUsers) * 100 : 0

		return NextResponse.json({
			totalUsers: {
				value: totalUsers,
				change: newUsersChange,
				newUsers,
			},
			monthlyRevenue: {
				value: monthlyRevenue._sum.amount || 0,
				change: revenueChange,
			},
			activeSubscriptions: {
				value: activeSubscriptions,
				change: subscriptionsChange,
			},
			averageUsage: {
				value: usageStats._avg.amount || 0,
				change: usageChange,
			},
		})
	} catch (error) {
		console.error("Error fetching dashboard stats:", error)
		return new NextResponse(JSON.stringify({ error: "Internal Server Error" }), { status: 500 })
	}
}


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

		// Get the last 12 months of revenue data
		const twelveMonthsAgo = new Date()
		twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11)
		twelveMonthsAgo.setDate(1)

		// Get all payments in the last 12 months
		const payments = await prisma.payment.findMany({
			where: {
				status: "COMPLETED",
				createdAt: {
					gte: twelveMonthsAgo,
				},
			},
			include: {
				subscription: {
					select: {
						interval: true,
					},
				},
			},
		})

		// Group payments by month and subscription type
		const revenueByMonth: Record<string, { monthly: number; annual: number; total: number }> = {}

		for (let i = 0; i < 12; i++) {
			const date = new Date(twelveMonthsAgo)
			date.setMonth(date.getMonth() + i)
			const monthKey = date.toISOString().substring(0, 7) // YYYY-MM format

			revenueByMonth[monthKey] = {
				monthly: 0,
				annual: 0,
				total: 0,
			}
		}

		payments.forEach((payment) => {
			const monthKey = payment.createdAt.toISOString().substring(0, 7)

			if (revenueByMonth[monthKey]) {
				const amount = payment.amount

				if (payment.subscription?.interval === "month") {
					revenueByMonth[monthKey].monthly += amount
				} else if (payment.subscription?.interval === "year") {
					revenueByMonth[monthKey].annual += amount
				}

				revenueByMonth[monthKey].total += amount
			}
		})

		// Convert to array format for the chart
		const revenueData = Object.entries(revenueByMonth).map(([month, data]) => ({
			date: `${month}-01`, // First day of the month
			monthly: data.monthly,
			annual: data.annual,
			total: data.total,
		}))

		return NextResponse.json({ revenue: revenueData })
	} catch (error) {
		console.error("Error fetching revenue data:", error)
		return new NextResponse(JSON.stringify({ error: "Internal Server Error" }), { status: 500 })
	}
}


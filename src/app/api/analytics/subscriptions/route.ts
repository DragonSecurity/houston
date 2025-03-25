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

		// Get all active subscriptions grouped by plan
		const subscriptionsByPlan = await prisma.subscription.groupBy({
			by: ["planId"],
			where: {
				status: "ACTIVE",
			},
			_count: {
				id: true,
			},
		})

		// Get plan details
		const plans = await prisma.plan.findMany({
			where: {
				id: {
					in: subscriptionsByPlan.map((s) => s.planId),
				},
			},
			select: {
				id: true,
				name: true,
			},
		})

		// Combine the data
		const planData = plans.map((plan) => {
			const subscription = subscriptionsByPlan.find((s) => s.planId === plan.id)
			return {
				name: plan.name,
				count: subscription?._count.id || 0,
			}
		})

		return NextResponse.json({ plans: planData })
	} catch (error) {
		console.error("Error fetching subscription distribution:", error)
		return new NextResponse(JSON.stringify({ error: "Internal Server Error" }), { status: 500 })
	}
}


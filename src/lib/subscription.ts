import { getPlanById } from "@/config/subscription-plans"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export type UsageType = "api_calls" | "storage" | "exports"

export async function checkUserLimit(
	userId: string,
	limitType: UsageType,
): Promise<{ allowed: boolean; current: number; limit: number; percentage: number }> {
	// Get user with subscription details
	const user = await prisma.user.findUnique({
		where: { id: userId },
		select: {
			planId: true,
			subscriptionStatus: true,
		},
	})

	if (!user) {
		throw new Error("User not found")
	}

	// Default to free plan if no plan is set
	const planId = user.planId || "free"
	const plan = getPlanById(planId)

	if (!plan) {
		throw new Error("Plan not found")
	}

	// Check if subscription is active for paid plans
	if (planId !== "free" && user.subscriptionStatus !== "active") {
		return {
			allowed: false,
			current: 0,
			limit: 0,
			percentage: 100,
		}
	}

	// Get the limit for this type from the plan
	const limitConfig = plan.limits[limitType]

	if (!limitConfig) {
		throw new Error(`Limit type ${limitType} not found in plan`)
	}

	// Get current usage for this month
	const startOfMonth = new Date()
	startOfMonth.setDate(1)
	startOfMonth.setHours(0, 0, 0, 0)

	const currentUsage = await prisma.usageItem.aggregate({
		where: {
			userId,
			itemType: limitType,
			createdAt: {
				gte: startOfMonth,
			},
		},
		_sum: {
			count: true,
		},
	})

	const current = currentUsage._sum.count || 0
	const limit = limitConfig.value
	const percentage = Math.min(Math.round((current / limit) * 100), 100)

	return {
		allowed: current < limit,
		current,
		limit,
		percentage,
	}
}

export async function incrementUsage(
	userId: string,
	itemType: UsageType,
	count = 1,
	metadata: Record<string, any> = {},
): Promise<void> {
	await prisma.usageItem.create({
		data: {
			userId,
			itemType,
			count,
			metadata,
		},
	})
}

export async function getCurrentUserPlan() {
	const session = await getServerSession(authOptions)

	if (!session?.user?.email) {
		return getPlanById("free")
	}

	const user = await prisma.user.findUnique({
		where: { email: session.user.email },
		select: {
			planId: true,
			subscriptionStatus: true,
			billingPeriod: true,
		},
	})

	if (!user) {
		return getPlanById("free")
	}

	// If user has a plan but subscription is not active, return free plan
	if (user.planId !== "free" && user.subscriptionStatus !== "active") {
		return getPlanById("free")
	}

	return getPlanById(user.planId || "free")
}

export async function getUserUsage(userId: string) {
	const plan = await getCurrentUserPlan()

	if (!plan) {
		throw new Error("Plan not found")
	}

	const usagePromises = Object.keys(plan.limits).map(async (limitType) => {
		return {
			type: limitType,
			...(await checkUserLimit(userId, limitType as UsageType)),
		}
	})

	return Promise.all(usagePromises)
}


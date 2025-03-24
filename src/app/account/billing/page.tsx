import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getPlanById, getAnnualSavingsPercentage } from "@/config/subscription-plans"
import { BillingHeader } from "./billing-header"
import { CurrentPlan } from "./current-plan"
import { UsageSummary } from "./usage-summary"
import { BillingHistory } from "./billing-history"
import { PaymentMethods } from "./payment-methods"
import { UpcomingInvoice } from "./upcoming-invoice"

export const metadata = {
	title: "Billing & Subscription",
	description: "Manage your subscription and billing information",
}

export default async function BillingPage() {
	const session = await getServerSession(authOptions)

	if (!session?.user?.email) {
		redirect("/login")
	}

	const user = await prisma.user.findUnique({
		where: { email: session.user.email },
		select: {
			id: true,
			name: true,
			email: true,
			stripeCustomerId: true,
			subscriptionId: true,
			subscriptionStatus: true,
			planId: true,
			billingPeriod: true,
			currentPeriodEnd: true,
		},
	})

	if (!user) {
		redirect("/login")
	}

	const plan = getPlanById(user.planId || "free")

	// Get usage data
	const startOfMonth = new Date()
	startOfMonth.setDate(1)
	startOfMonth.setHours(0, 0, 0, 0)

	const usageItems = await prisma.usageItem.groupBy({
		by: ["itemType"],
		where: {
			userId: user.id,
			createdAt: {
				gte: startOfMonth,
			},
		},
		_sum: {
			count: true,
		},
	})

	const usage = Object.fromEntries(usageItems.map((item) => [item.itemType, item._sum.count || 0]))

	return (
		<div className="container max-w-5xl py-8">
			<BillingHeader />

			<div className="grid gap-8 mt-8 md:grid-cols-3">
				<div className="md:col-span-2 space-y-8">
					<CurrentPlan
						plan={plan}
						user={user}
						savings={user.billingPeriod === "annual" ? getAnnualSavingsPercentage(plan!) : 0}
					/>

					<UsageSummary plan={plan} usage={usage} />

					{user.subscriptionStatus === "active" && user.subscriptionId && (
						<UpcomingInvoice subscriptionId={user.subscriptionId} customerId={user.stripeCustomerId!} />
					)}

					{user.stripeCustomerId && <BillingHistory customerId={user.stripeCustomerId} />}
				</div>

				<div className="space-y-8">
					{user.stripeCustomerId && <PaymentMethods customerId={user.stripeCustomerId} />}
				</div>
			</div>
		</div>
	)
}


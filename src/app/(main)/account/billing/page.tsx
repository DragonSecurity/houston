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
		where: {
			email: session.user.email,
		},
		include: {
			subscriptions: true
		}
	})

	if (!user) {
		redirect("/login")
	}

	// Get usage data
	const startOfMonth = new Date()
	startOfMonth.setDate(1)
	startOfMonth.setHours(0, 0, 0, 0)

	return (
		<div className="container max-w-5xl py-8">
			<BillingHeader />
			<pre>{JSON.stringify(user, null, 2)}</pre>
			<div className="grid gap-8 mt-8 md:grid-cols-3">
				<div className="md:col-span-2 space-y-8">
				</div>
			</div>
		</div>
	)
}


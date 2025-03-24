import type { Metadata } from "next"
import { PricingToggle } from "./pricing-toggle"
import { getCurrentUserPlan } from "@/lib/subscription"

export const metadata: Metadata = {
	title: "Pricing",
	description: "Choose the perfect plan for your needs",
}

export default async function PricingPage() {
	const currentPlan = await getCurrentUserPlan()

	return (
		<div className="container max-w-5xl py-12">
			<div className="text-center mb-12">
				<h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Simple, transparent pricing</h1>
				<p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
					Choose the perfect plan for your needs. All plans include a 14-day free trial. No credit card required to
					start.
				</p>
			</div>

			<PricingToggle currentPlanId={currentPlan?.id || "free"} />
		</div>
	)
}


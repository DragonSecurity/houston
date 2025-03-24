"use client"

import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { PricingCards } from "./pricing-cards"
import { Badge } from "@/components/ui/badge"

interface PricingToggleProps {
	currentPlanId: string
}

export function PricingToggle({ currentPlanId }: PricingToggleProps) {
	const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annual">("monthly")

	const handleToggleChange = (checked: boolean) => {
		setBillingPeriod(checked ? "annual" : "monthly")
	}

	return (
		<div className="space-y-8">
			<div className="flex flex-col items-center justify-center space-y-4">
				<div className="flex items-center space-x-2">
          <span
	          className={`text-sm font-medium ${billingPeriod === "monthly" ? "text-primary" : "text-muted-foreground"}`}
          >
            Monthly
          </span>

					<div className="flex items-center space-x-2">
						<Switch id="billing-toggle" checked={billingPeriod === "annual"} onCheckedChange={handleToggleChange} />
					</div>

					<div className="flex items-center">
            <span
	            className={`text-sm font-medium ${billingPeriod === "annual" ? "text-primary" : "text-muted-foreground"}`}
            >
              Annual
            </span>
						<Badge className="ml-2 bg-green-100 text-green-800 hover:bg-green-100">Save up to 20%</Badge>
					</div>
				</div>

				<p className="text-sm text-muted-foreground">
					{billingPeriod === "annual"
						? "Save with annual billing, billed yearly."
						: "Flexible monthly billing, cancel anytime."}
				</p>
			</div>

			<PricingCards billingPeriod={billingPeriod} currentPlanId={currentPlanId} />
		</div>
	)
}


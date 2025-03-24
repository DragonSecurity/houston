"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckIcon, XIcon } from "lucide-react"
import { SUBSCRIPTION_PLANS, formatPrice, getAnnualSavingsPercentage } from "@/config/subscription-plans"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface PricingCardsProps {
	billingPeriod: "monthly" | "annual"
	currentPlanId: string
}

export function PricingCards({ billingPeriod, currentPlanId }: PricingCardsProps) {
	const router = useRouter()
	const [isLoading, setIsLoading] = useState<string | null>(null)

	const handleSubscribe = async (planId: string) => {
		if (planId === currentPlanId) {
			router.push("/dashboard")
			return
		}

		setIsLoading(planId)

		try {
			const response = await fetch("/api/subscription/create-checkout", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					planId,
					billingPeriod,
				}),
			})

			const data = await response.json()

			if (data.url) {
				window.location.href = data.url
			} else {
				console.error("Failed to create checkout session")
			}
		} catch (error) {
			console.error("Error creating checkout session:", error)
		} finally {
			setIsLoading(null)
		}
	}

	return (
		<div className="grid gap-6 md:grid-cols-3">
			{SUBSCRIPTION_PLANS.map((plan) => {
				const price = billingPeriod === "monthly" ? plan.monthlyPrice : plan.annualPrice
				const priceDisplay = formatPrice(price)
				const isCurrentPlan = plan.id === currentPlanId
				const savingsPercentage = billingPeriod === "annual" ? getAnnualSavingsPercentage(plan) : 0

				return (
					<Card
						key={plan.id}
						className={`flex flex-col transition-all duration-300 ease-in-out ${plan.popular ? "border-primary shadow-lg" : ""}`}
					>
						<CardHeader>
							{plan.popular && <Badge className="w-fit mb-2">Most Popular</Badge>}
							<CardTitle>{plan.name}</CardTitle>
							<CardDescription>{plan.description}</CardDescription>
							<div className="mt-4">
								<span className="text-3xl font-bold">{priceDisplay}</span>
								{price > 0 && (
									<span className="text-muted-foreground ml-1">/{billingPeriod === "monthly" ? "month" : "year"}</span>
								)}
								{billingPeriod === "annual" && savingsPercentage > 0 && (
									<div className="flex items-center mt-1">
										<Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
											Save {savingsPercentage}%
										</Badge>
										<span className="text-sm text-muted-foreground ml-2">
                      {formatPrice(plan.monthlyPrice)}/mo equivalent
                    </span>
									</div>
								)}
							</div>
						</CardHeader>
						<CardContent className="flex-grow">
							<div className="space-y-4">
								<h4 className="text-sm font-medium">Features</h4>
								<ul className="space-y-2.5">
									{plan.features.map((feature, index) => (
										<li key={index} className="flex items-start gap-2">
											{feature.included ? (
												<CheckIcon className="h-4 w-4 text-green-500 mt-0.5" />
											) : (
												<XIcon className="h-4 w-4 text-muted-foreground mt-0.5" />
											)}
											<span className={feature.included ? "" : "text-muted-foreground"}>{feature.title}</span>
										</li>
									))}
								</ul>

								<h4 className="text-sm font-medium pt-4">Limits</h4>
								<ul className="space-y-2.5">
									{Object.values(plan.limits).map((limit) => (
										<li key={limit.name} className="flex items-start gap-2">
											<CheckIcon className="h-4 w-4 text-green-500 mt-0.5" />
											<span>
                        {limit.value.toLocaleString()} {limit.title} {limit.unit}
                      </span>
										</li>
									))}
								</ul>
							</div>
						</CardContent>
						<CardFooter>
							<Button
								size="lg"
								className="w-full"
								variant={plan.popular ? "default" : "outline"}
								disabled={isLoading !== null}
								onClick={() => handleSubscribe(plan.id)}
							>
								{isLoading === plan.id ? "Loading..." : isCurrentPlan ? "Current Plan" : `Subscribe to ${plan.name}`}
							</Button>
						</CardFooter>
					</Card>
				)
			})}
		</div>
	)
}


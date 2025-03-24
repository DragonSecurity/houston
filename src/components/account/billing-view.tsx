"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useRouter, useSearchParams } from "next/navigation"
import { Check } from "lucide-react"
import {toast} from "sonner";

interface Plan {
	id: string
	name: string
	description: string
	price: {
		id: string
		currency: string
		unit_amount: number | null
		interval: string | null
		interval_count: number | null
	}
	features: string[]
}

interface BillingViewProps {
	currentPlan?: string
	hasStripeCustomer?: boolean
}

export function BillingView({ currentPlan = "free", hasStripeCustomer = false }: BillingViewProps) {
	const [plans, setPlans] = useState<Plan[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [isRedirecting, setIsRedirecting] = useState(false)
	const router = useRouter()
	const searchParams = useSearchParams()

	useEffect(() => {
		// Check for success or canceled query parameters
		const success = searchParams.get("success")
		const canceled = searchParams.get("canceled")

		if (success) {
			toast.success("Subscription updated",{
				description: "Your subscription has been updated successfully.",
			})
			router.replace("/account/billing")
		} else if (canceled) {
			toast.success("Subscription update canceled",{
				description: "Your subscription update was canceled.",
			})
			router.replace("/account/billing")
		}
	}, [searchParams, toast, router])

	useEffect(() => {
		async function fetchPlans() {
			try {
				// In a real app, you would fetch this from your API
				// For now, we'll use mock data
				const mockPlans: Plan[] = [
					{
						id: "free",
						name: "Free",
						description: "Basic features for personal use",
						price: {
							id: "price_free",
							currency: "usd",
							unit_amount: 0,
							interval: "month",
							interval_count: 1,
						},
						features: ["1 user", "5 projects", "Basic analytics", "24-hour support response time"],
					},
					{
						id: "pro",
						name: "Pro",
						description: "Advanced features for professionals",
						price: {
							id: "price_pro",
							currency: "usd",
							unit_amount: 1999,
							interval: "month",
							interval_count: 1,
						},
						features: ["5 users", "20 projects", "Advanced analytics", "4-hour support response time", "API access"],
					},
					{
						id: "enterprise",
						name: "Enterprise",
						description: "Complete solution for teams",
						price: {
							id: "price_enterprise",
							currency: "usd",
							unit_amount: 4999,
							interval: "month",
							interval_count: 1,
						},
						features: [
							"Unlimited users",
							"Unlimited projects",
							"Custom analytics",
							"1-hour support response time",
							"API access",
							"Custom integrations",
							"Dedicated account manager",
						],
					},
				]

				setPlans(mockPlans)
			} catch (error) {
				console.error("Failed to fetch plans:", error)
				toast.error("Failed to load plans",{
					description: "Please try again later.",
				})
			} finally {
				setIsLoading(false)
			}
		}

		fetchPlans()
	}, [toast])

	const handleSubscribe = async (priceId: string) => {
		setIsRedirecting(true)

		try {
			const response = await fetch("/api/stripe/checkout", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ priceId }),
			})

			const data = await response.json()

			if (!response.ok) {
				throw new Error(data.error || "Failed to create checkout session")
			}

			// Redirect to Stripe Checkout
			window.location.href = data.url
		} catch (error) {
			console.error("Subscription error:", error)
			toast.error("Something went wrong",{
				description: error instanceof Error ? error.message : "Failed to create checkout session",
			})
			setIsRedirecting(false)
		}
	}

	const handleManageSubscription = async () => {
		setIsRedirecting(true)

		try {
			const response = await fetch("/api/stripe/portal", {
				method: "POST",
			})

			const data = await response.json()

			if (!response.ok) {
				throw new Error(data.error || "Failed to create customer portal session")
			}

			// Redirect to Stripe Customer Portal
			window.location.href = data.url
		} catch (error) {
			console.error("Customer portal error:", error)
			toast.error("Something went wrong",{
				description: error instanceof Error ? error.message : "Failed to create customer portal session",
			})
			setIsRedirecting(false)
		}
	}

	const formatCurrency = (amount: number | null, currency: string) => {
		if (amount === null) return "Free"

		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: currency,
			minimumFractionDigits: 0,
		}).format(amount / 100)
	}

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<h2 className="text-2xl font-bold">Subscription Plans</h2>
				{hasStripeCustomer && (
					<Button variant="outline" onClick={handleManageSubscription} disabled={isRedirecting}>
						{isRedirecting ? "Redirecting..." : "Manage Subscription"}
					</Button>
				)}
			</div>

			{isLoading ? (
				<div className="grid gap-6 md:grid-cols-3">
					{[1, 2, 3].map((i) => (
						<Card key={i} className="flex flex-col">
							<CardHeader>
								<Skeleton className="h-8 w-24 mb-2" />
								<Skeleton className="h-4 w-full" />
							</CardHeader>
							<CardContent className="flex-grow">
								<Skeleton className="h-6 w-32 mb-4" />
								<div className="space-y-2">
									{[1, 2, 3, 4].map((j) => (
										<Skeleton key={j} className="h-4 w-full" />
									))}
								</div>
							</CardContent>
							<CardFooter>
								<Skeleton className="h-10 w-full" />
							</CardFooter>
						</Card>
					))}
				</div>
			) : (
				<div className="grid gap-6 md:grid-cols-3">
					{plans.map((plan) => (
						<Card key={plan.id} className={`flex flex-col ${currentPlan === plan.id ? "border-primary" : ""}`}>
							<CardHeader>
								<div className="flex justify-between items-center">
									<CardTitle>{plan.name}</CardTitle>
									{currentPlan === plan.id && <Badge>Current Plan</Badge>}
								</div>
								<CardDescription>{plan.description}</CardDescription>
							</CardHeader>
							<CardContent className="flex-grow">
								<div className="mb-4">
                  <span className="text-3xl font-bold">
                    {formatCurrency(plan.price.unit_amount, plan.price.currency)}
                  </span>
									{plan.price.interval && <span className="text-muted-foreground">/{plan.price.interval}</span>}
								</div>
								<ul className="space-y-2">
									{plan.features.map((feature, index) => (
										<li key={index} className="flex items-center">
											<Check className="h-4 w-4 mr-2 text-green-500" />
											<span>{feature}</span>
										</li>
									))}
								</ul>
							</CardContent>
							<CardFooter>
								<Button
									className="w-full"
									variant={currentPlan === plan.id ? "outline" : "default"}
									disabled={
										isRedirecting || currentPlan === plan.id || (plan.price.unit_amount === 0 && currentPlan !== "free")
									}
									onClick={() => handleSubscribe(plan.price.id)}
								>
									{isRedirecting
										? "Redirecting..."
										: currentPlan === plan.id
											? "Current Plan"
											: plan.price.unit_amount === 0
												? "Downgrade"
												: "Subscribe"}
								</Button>
							</CardFooter>
						</Card>
					))}
				</div>
			)}
		</div>
	)
}


"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle2, AlertTriangle } from "lucide-react"
import { formatPrice, type SubscriptionPlan } from "@/config/subscription-plans"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import {toast} from "sonner";

interface CurrentPlanProps {
	plan: SubscriptionPlan | undefined
	user: {
		subscriptionStatus: string | null
		billingPeriod: string | null
		currentPeriodEnd: Date | null
	}
	savings: number
}

export function CurrentPlan({ plan, user, savings }: CurrentPlanProps) {
	const router = useRouter()
	const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
	const [isLoading, setIsLoading] = useState(false)

	if (!plan) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Current Plan</CardTitle>
					<CardDescription>Your subscription information</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex items-center space-x-2 text-yellow-600">
						<AlertTriangle size={20} />
						<p>Plan information not available</p>
					</div>
				</CardContent>
				<CardFooter>
					<Button asChild>
						<Link href="/pricing">View Plans</Link>
					</Button>
				</CardFooter>
			</Card>
		)
	}

	const isActive = user.subscriptionStatus === "active"
	const isCanceled = user.subscriptionStatus === "canceled"
	const isPastDue = user.subscriptionStatus === "past_due"
	const isFreePlan = plan.id === "free"

	const formatDate = (date: Date | null) => {
		if (!date) return "N/A"
		return new Intl.DateTimeFormat("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		}).format(date)
	}

	const handleCancelSubscription = async () => {
		try {
			setIsLoading(true)
			const response = await fetch("/api/subscription/cancel")

			if (!response.ok) {
				throw new Error("Failed to cancel subscription")
			}

			setCancelDialogOpen(false)
			toast.success("Subscription canceled",{
				description: "Your subscription will end at the end of the current billing period.",
			})

			router.refresh()
		} catch (error) {
			console.error("Error canceling subscription:", error)
			toast.error("Error", {
				description: "Failed to cancel subscription. Please try again.",
			})
		} finally {
			setIsLoading(false)
		}
	}

	const handleManageSubscription = async () => {
		try {
			setIsLoading(true)
			window.location.href = "/api/subscription/portal"
		} catch (error) {
			console.error("Error accessing billing portal:", error)
			toast.error("Error",{
				description: "Failed to access billing portal. Please try again.",
			})
			setIsLoading(false)
		}
	}

	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<div>
						<CardTitle>Current Plan</CardTitle>
						<CardDescription>Your subscription information</CardDescription>
					</div>
					{!isFreePlan && (
						<div>
							{isActive && <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>}
							{isCanceled && (
								<Badge variant="outline" className="text-yellow-600 border-yellow-300">
									Canceled
								</Badge>
							)}
							{isPastDue && <Badge variant="destructive">Past Due</Badge>}
						</div>
					)}
				</div>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="flex items-center justify-between">
					<div>
						<h3 className="text-xl font-bold">{plan.name}</h3>
						<p className="text-sm text-muted-foreground">{plan.description}</p>
					</div>
					<div className="text-right">
						{isFreePlan ? (
							<p className="text-xl font-bold">Free</p>
						) : (
							<>
								<p className="text-xl font-bold">
									{formatPrice(user.billingPeriod === "annual" ? plan.annualPrice / 12 : plan.monthlyPrice)}
									<span className="text-sm font-normal text-muted-foreground">/mo</span>
								</p>
								{user.billingPeriod === "annual" && (
									<p className="text-sm text-muted-foreground">Billed annually ({formatPrice(plan.annualPrice)})</p>
								)}
							</>
						)}
					</div>
				</div>

				{!isFreePlan && (
					<div className="space-y-2">
						{user.billingPeriod === "annual" && savings > 0 && (
							<div className="flex items-center text-sm text-green-600">
								<CheckCircle2 size={16} className="mr-1" />
								<span>Saving {savings}% with annual billing</span>
							</div>
						)}

						{user.currentPeriodEnd && (
							<div className="text-sm">
								{isCanceled ? (
									<p>
										Your subscription will end on{" "}
										<span className="font-medium">{formatDate(user.currentPeriodEnd)}</span>
									</p>
								) : (
									<p>
										Next billing date: <span className="font-medium">{formatDate(user.currentPeriodEnd)}</span>
									</p>
								)}
							</div>
						)}
					</div>
				)}
			</CardContent>
			<CardFooter className="flex justify-between">
				{isFreePlan ? (
					<Button asChild>
						<Link href="/pricing">Upgrade Plan</Link>
					</Button>
				) : (
					<>
						<Button variant="outline" onClick={handleManageSubscription} disabled={isLoading}>
							Manage Subscription
						</Button>

						{!isCanceled && (
							<Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
								<DialogTrigger asChild>
									<Button
										variant="ghost"
										className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
									>
										Cancel Subscription
									</Button>
								</DialogTrigger>
								<DialogContent>
									<DialogHeader>
										<DialogTitle>Cancel Subscription</DialogTitle>
										<DialogDescription>
											Are you sure you want to cancel your subscription? You&#39;ll lose access to premium features at the
											end of your current billing period.
										</DialogDescription>
									</DialogHeader>
									<div className="flex items-center space-x-2 text-yellow-600 bg-yellow-50 p-3 rounded-md">
										<AlertCircle size={20} />
										<p className="text-sm">
											Your subscription will remain active until {formatDate(user.currentPeriodEnd)}.
										</p>
									</div>
									<DialogFooter>
										<Button variant="outline" onClick={() => setCancelDialogOpen(false)}>
											Keep Subscription
										</Button>
										<Button variant="destructive" onClick={handleCancelSubscription} disabled={isLoading}>
											{isLoading ? "Canceling..." : "Cancel Subscription"}
										</Button>
									</DialogFooter>
								</DialogContent>
							</Dialog>
						)}
					</>
				)}
			</CardFooter>
		</Card>
	)
}


"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { SubscriptionPlan } from "@/config/subscription-plans"
import { AlertCircle } from "lucide-react"

interface UsageSummaryProps {
	plan: SubscriptionPlan | undefined
	usage: Record<string, number>
}

export function UsageSummary({ plan, usage }: UsageSummaryProps) {
	if (!plan) {
		return null
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Usage</CardTitle>
				<CardDescription>Your current usage for this billing period</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				{Object.entries(plan.limits).map(([key, limit]) => {
					const currentUsage = usage[key] || 0
					const percentage = Math.min(Math.round((currentUsage / limit.value) * 100), 100)
					const isNearLimit = percentage >= 80
					const isAtLimit = percentage >= 100

					return (
						<div key={key} className="space-y-2">
							<div className="flex items-center justify-between">
								<div className="flex items-center">
									<span className="font-medium">{limit.title}</span>
									{isAtLimit && (
										<span className="ml-2 inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                      Limit reached
                    </span>
									)}
									{isNearLimit && !isAtLimit && (
										<span className="ml-2 inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                      Near limit
                    </span>
									)}
								</div>
								<span className="text-sm text-muted-foreground">
                  {currentUsage} / {limit.value} {limit.unit}
                </span>
							</div>
							<Progress value={percentage} className={isAtLimit ? "bg-red-100" : isNearLimit ? "bg-yellow-100" : ""} />
							{isAtLimit && (
								<div className="flex items-center space-x-2 text-sm text-red-600">
									<AlertCircle size={16} />
									<span>You&#39;ve reached your {limit.title.toLowerCase()} limit for this billing period.</span>
								</div>
							)}
						</div>
					)
				})}
			</CardContent>
		</Card>
	)
}


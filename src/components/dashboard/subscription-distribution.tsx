"use client"

import { useSubscriptionDistribution } from "@/hooks/use-queries"
import { PieChart } from "@/components/ui/recharts/pie-chart"
import { formatNumber } from "@/lib/format"
import { Skeleton } from "@/components/ui/skeleton"
import { memo } from "react"

function SubscriptionDistributionComponent() {
	const { data, isLoading, error } = useSubscriptionDistribution()

	if (isLoading) {
		return <Skeleton className="h-[400px] w-full" />
	}

	if (error || !data?.plans) {
		return (
			<div className="flex h-[400px] w-full items-center justify-center rounded-md border border-dashed p-8 text-center">
				<div>
					<p className="text-sm text-muted-foreground">Failed to load subscription data</p>
				</div>
			</div>
		)
	}

	// Format the data for the chart
	const chartData = data.plans.map((plan) => ({
		name: plan.name,
		value: plan.count,
	}))

	return (
		<PieChart
			title="Subscription Plans"
			description="Distribution of users across subscription plans"
			data={chartData}
			colors={["#2563eb", "#16a34a", "#ef4444", "#eab308"]}
			valueFormatter={formatNumber}
			innerRadius={60}
			outerRadius={90}
		/>
	)
}

// Memoize the component to prevent unnecessary re-renders
export const SubscriptionDistribution = memo(SubscriptionDistributionComponent)


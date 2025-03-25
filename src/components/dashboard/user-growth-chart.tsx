"use client"

import { useUserGrowth } from "@/hooks/use-queries"
import { LineChart } from "@/components/ui/recharts/line-chart"
import { formatNumber, formatDate } from "@/lib/format"
import { Skeleton } from "@/components/ui/skeleton"
import { memo } from "react"

function UserGrowthChartComponent() {
	const { data, isLoading, error } = useUserGrowth()

	if (isLoading) {
		return <Skeleton className="h-[400px] w-full" />
	}

	if (error || !data?.growth) {
		return (
			<div className="flex h-[400px] w-full items-center justify-center rounded-md border border-dashed p-8 text-center">
				<div>
					<p className="text-sm text-muted-foreground">Failed to load user growth data</p>
				</div>
			</div>
		)
	}

	// Format the data for the chart
	const chartData = data.growth.map((item) => ({
		date: formatDate(new Date(item.date), "MMM d"),
		"New Users": item.newUsers,
		"Total Users": item.totalUsers,
	}))

	return (
		<LineChart
			title="User Growth"
			description="New and total users over time"
			data={chartData}
			index="date"
			categories={["New Users", "Total Users"]}
			colors={["#ef4444", "#2563eb"]}
			valueFormatter={formatNumber}
		/>
	)
}

// Memoize the component to prevent unnecessary re-renders
export const UserGrowthChart = memo(UserGrowthChartComponent)


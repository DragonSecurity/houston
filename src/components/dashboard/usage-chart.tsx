"use client"

import { useUsageData } from "@/hooks/use-queries"
import { AreaChart } from "@/components/ui/recharts/area-chart"
import { formatNumber, formatDate } from "@/lib/format"
import { Skeleton } from "@/components/ui/skeleton"
import { memo } from "react"

function UsageChartComponent({ userId }: { userId: string }) {
	const { data, isLoading, error } = useUsageData(userId)

	if (isLoading) {
		return <Skeleton className="h-[400px] w-full" />
	}

	if (error || !data?.usage) {
		return (
			<div className="flex h-[400px] w-full items-center justify-center rounded-md border border-dashed p-8 text-center">
				<div>
					<p className="text-sm text-muted-foreground">Failed to load usage data</p>
				</div>
			</div>
		)
	}

	// Format the data for the chart
	const chartData = data.usage.map((item) => ({
		date: formatDate(new Date(item.date), "MMM d"),
		API: item.api,
		Storage: item.storage,
		Bandwidth: item.bandwidth,
	}))

	return (
		<AreaChart
			title="Resource Usage"
			description="API calls, storage, and bandwidth usage over time"
			data={chartData}
			index="date"
			categories={["API", "Storage", "Bandwidth"]}
			colors={["#2563eb", "#16a34a", "#ef4444"]}
			valueFormatter={formatNumber}
			stack={false}
		/>
	)
}

// Memoize the component to prevent unnecessary re-renders
export const UsageChart = memo(UsageChartComponent)


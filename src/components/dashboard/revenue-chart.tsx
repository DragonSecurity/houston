"use client"

import { useRevenueData } from "@/hooks/use-queries"
import { BarChart } from "@/components/ui/recharts/bar-chart"
import { formatCurrency, formatDate } from "@/lib/format"
import { Skeleton } from "@/components/ui/skeleton"
import { memo } from "react"

function RevenueChartComponent() {
	const { data, isLoading, error } = useRevenueData()

	if (isLoading) {
		return <Skeleton className="h-[400px] w-full" />
	}

	if (error || !data?.revenue) {
		return (
			<div className="flex h-[400px] w-full items-center justify-center rounded-md border border-dashed p-8 text-center">
				<div>
					<p className="text-sm text-muted-foreground">Failed to load revenue data</p>
				</div>
			</div>
		)
	}

	// Format the data for the chart
	const chartData = data.revenue.map((item) => ({
		month: formatDate(new Date(item.date), "MMM yyyy"),
		Monthly: item.monthly,
		Annual: item.annual,
		Total: item.total,
	}))

	return (
		<BarChart
			title="Revenue"
			description="Monthly and annual subscription revenue"
			data={chartData}
			index="month"
			categories={["Monthly", "Annual", "Total"]}
			colors={["#2563eb", "#16a34a", "#6366f1"]}
			valueFormatter={formatCurrency}
			stack={false}
		/>
	)
}

// Memoize the component to prevent unnecessary re-renders
export const RevenueChart = memo(RevenueChartComponent)


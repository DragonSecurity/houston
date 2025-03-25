"use client"

import {
	ResponsiveContainer,
	BarChart as RechartsBarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
} from "recharts"
import { BaseChart } from "./base-chart"
import { memo } from "react"
import type { BarChartProps } from "@/types"

function BarChartComponent({
	                           title,
	                           description,
	                           data,
	                           categories,
	                           index,
	                           colors = ["#2563eb", "#16a34a", "#ef4444", "#eab308", "#6366f1"],
	                           valueFormatter = (value: number) => value.toString(),
	                           className,
	                           showLegend = true,
	                           showGrid = true,
	                           showTooltip = true,
	                           showXAxis = true,
	                           showYAxis = true,
	                           layout = "horizontal",
	                           stack = false,
                           }: BarChartProps) {
	return (
		<BaseChart title={title} description={description} className={className}>
			<ResponsiveContainer width="100%" height="100%">
				<RechartsBarChart
					data={data}
					layout={layout}
					margin={{
						top: 10,
						right: 30,
						left: 0,
						bottom: 0,
					}}
				>
					{showGrid && <CartesianGrid strokeDasharray="3 3" />}
					{showXAxis && <XAxis dataKey={index} />}
					{showYAxis && <YAxis />}
					{showTooltip && <Tooltip formatter={(value: number) => [valueFormatter(value), ""]} />}
					{showLegend && <Legend />}
					{categories.map((category, i) => (
						<Bar
							key={category}
							dataKey={category}
							fill={colors[i % colors.length]}
							stackId={stack ? "stack" : undefined}
						/>
					))}
				</RechartsBarChart>
			</ResponsiveContainer>
		</BaseChart>
	)
}

// Memoize the component to prevent unnecessary re-renders
export const BarChart = memo(BarChartComponent)


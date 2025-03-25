"use client"

import {
	ResponsiveContainer,
	LineChart as RechartsLineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
} from "recharts"
import { BaseChart } from "./base-chart"
import { memo } from "react"
import type { LineChartProps } from "@/types"

function LineChartComponent({
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
                            }: LineChartProps) {
	return (
		<BaseChart title={title} description={description} className={className}>
			<ResponsiveContainer width="100%" height="100%">
				<RechartsLineChart
					data={data}
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
						<Line
							key={category}
							type="monotone"
							dataKey={category}
							stroke={colors[i % colors.length]}
							activeDot={{ r: 8 }}
							strokeWidth={2}
						/>
					))}
				</RechartsLineChart>
			</ResponsiveContainer>
		</BaseChart>
	)
}

// Memoize the component to prevent unnecessary re-renders
export const LineChart = memo(LineChartComponent)


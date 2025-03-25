"use client"

import {
	ResponsiveContainer,
	AreaChart as RechartsAreaChart,
	Area,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
} from "recharts"
import { BaseChart } from "./base-chart"
import { memo } from "react"
import type { AreaChartProps } from "@/types"

function AreaChartComponent({
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
	                            stack = false,
                            }: AreaChartProps) {
	return (
		<BaseChart title={title} description={description} className={className}>
			<ResponsiveContainer width="100%" height="100%">
				<RechartsAreaChart
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
						<Area
							key={category}
							type="monotone"
							dataKey={category}
							fill={colors[i % colors.length]}
							stroke={colors[i % colors.length]}
							fillOpacity={0.3}
							stackId={stack ? "stack" : undefined}
						/>
					))}
				</RechartsAreaChart>
			</ResponsiveContainer>
		</BaseChart>
	)
}

// Memoize the component to prevent unnecessary re-renders
export const AreaChart = memo(AreaChartComponent)


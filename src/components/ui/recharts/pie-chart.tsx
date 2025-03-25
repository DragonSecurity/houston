"use client"

import { ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, Tooltip, Legend } from "recharts"
import { BaseChart } from "./base-chart"
import { memo } from "react"
import type { PieChartProps } from "@/types"

function PieChartComponent({
	                           title,
	                           description,
	                           data,
	                           colors = ["#2563eb", "#16a34a", "#ef4444", "#eab308", "#6366f1"],
	                           valueFormatter = (value: number) => value.toString(),
	                           className,
	                           showLegend = true,
	                           showTooltip = true,
	                           innerRadius = 0,
	                           outerRadius = 80,
                           }: PieChartProps) {
	return (
		<BaseChart title={title} description={description} className={className}>
			<ResponsiveContainer width="100%" height="100%">
				<RechartsPieChart>
					<Pie
						data={data}
						cx="50%"
						cy="50%"
						labelLine={false}
						innerRadius={innerRadius}
						outerRadius={outerRadius}
						dataKey="value"
						label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
					>
						{data.map((entry, index) => (
							<Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
						))}
					</Pie>
					{showTooltip && <Tooltip formatter={(value: number) => [valueFormatter(value), ""]} />}
					{showLegend && <Legend />}
				</RechartsPieChart>
			</ResponsiveContainer>
		</BaseChart>
	)
}

// Memoize the component to prevent unnecessary re-renders
export const PieChart = memo(PieChartComponent)


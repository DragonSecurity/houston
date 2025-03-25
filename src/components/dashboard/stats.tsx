"use client"

import type React from "react"

import { useDashboardStats } from "@/hooks/use-queries"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowDownIcon, ArrowUpIcon, Users, DollarSign, CreditCard, Activity } from "lucide-react"
import { formatCurrency, formatNumber, formatPercentage } from "@/lib/format"
import { memo } from "react"

interface StatsCardProps {
	title: string
	value: string
	description: string
	icon: React.ReactNode
	trend: number
}

const StatsCard = memo(function StatsCard({ title, value, description, icon, trend }: StatsCardProps) {
	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between pb-2">
				<CardTitle className="text-sm font-medium">{title}</CardTitle>
				<div className="h-4 w-4 text-muted-foreground">{icon}</div>
			</CardHeader>
			<CardContent>
				<div className="text-2xl font-bold">{value}</div>
				<p className="text-xs text-muted-foreground">{description}</p>
				{trend !== 0 && (
					<div className="mt-1 flex items-center text-xs">
						{trend > 0 ? (
							<ArrowUpIcon className="mr-1 h-3 w-3 text-green-500" />
						) : (
							<ArrowDownIcon className="mr-1 h-3 w-3 text-red-500" />
						)}
						<span className={trend > 0 ? "text-green-500" : "text-red-500"}>{formatPercentage(Math.abs(trend))}</span>
						<span className="ml-1 text-muted-foreground">from last month</span>
					</div>
				)}
			</CardContent>
		</Card>
	)
})

function DashboardStatsComponent() {
	const { data, isLoading, error } = useDashboardStats()

	if (isLoading) {
		return (
			<>
				{Array(4)
					.fill(0)
					.map((_, i) => (
						<Skeleton key={i} className="h-[120px] w-full" />
					))}
			</>
		)
	}

	if (error) {
		return <div className="col-span-4 p-4 text-center text-red-500">Error loading dashboard stats</div>
	}

	return (
		<>
			<StatsCard
				title="Total Users"
				value={formatNumber(data.totalUsers.value)}
				description={`${formatNumber(data.totalUsers.newUsers)} new users this month`}
				icon={<Users className="h-4 w-4" />}
				trend={data.totalUsers.change}
			/>
			<StatsCard
				title="Monthly Revenue"
				value={formatCurrency(data.monthlyRevenue.value)}
				description="Total revenue this month"
				icon={<DollarSign className="h-4 w-4" />}
				trend={data.monthlyRevenue.change}
			/>
			<StatsCard
				title="Active Subscriptions"
				value={formatNumber(data.activeSubscriptions.value)}
				description="Current active subscriptions"
				icon={<CreditCard className="h-4 w-4" />}
				trend={data.activeSubscriptions.change}
			/>
			<StatsCard
				title="Average Usage"
				value={formatNumber(data.averageUsage.value)}
				description="Average usage per user"
				icon={<Activity className="h-4 w-4" />}
				trend={data.averageUsage.change}
			/>
		</>
	)
}

// Memoize the component to prevent unnecessary re-renders
export const DashboardStats = memo(DashboardStatsComponent)


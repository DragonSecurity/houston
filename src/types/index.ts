// User types
export interface User {
	id: string
	name: string
	email: string
	image?: string
	role: "USER" | "ADMIN"
	createdAt: Date
}

// Subscription types
export interface Subscription {
	id: string
	userId: string
	status: "ACTIVE" | "CANCELED" | "PAST_DUE" | "TRIALING"
	planId: string
	currentPeriodEnd: Date
	cancelAtPeriodEnd: boolean
	interval: "month" | "year"
	plan?: Plan
}

export interface Plan {
	id: string
	name: string
	description: string
	price: number
	features: string[]
	limits: PlanLimits
}

export interface PlanLimits {
	apiCalls: number
	storage: number
	projects: number
	teamMembers: number
}

// Usage types
export interface Usage {
	id: string
	subscriptionId: string
	apiCalls: number
	storage: number
	bandwidth: number
	createdAt: Date
}

export interface UsageData {
	date: string
	api: number
	storage: number
	bandwidth: number
}

// Analytics types
export interface RevenueData {
	date: string
	monthly: number
	annual: number
	total: number
}

export interface SubscriptionPlanData {
	name: string
	count: number
}

export interface UserGrowthData {
	date: string
	newUsers: number
	totalUsers: number
}

export interface DashboardStats {
	totalUsers: {
		value: number
		newUsers: number
		change: number
	}
	monthlyRevenue: {
		value: number
		change: number
	}
	activeSubscriptions: {
		value: number
		change: number
	}
	averageUsage: {
		value: number
		change: number
	}
}

// Chart types
export interface ChartDataPoint {
	[key: string]: string | number
}

export interface LineChartProps {
	title?: string
	description?: string
	data: ChartDataPoint[]
	categories: string[]
	index: string
	colors?: string[]
	valueFormatter?: (value: number) => string
	className?: string
	showLegend?: boolean
	showGrid?: boolean
	showTooltip?: boolean
	showXAxis?: boolean
	showYAxis?: boolean
}

export interface BarChartProps extends LineChartProps {
	layout?: "vertical" | "horizontal"
	stack?: boolean
}

export interface AreaChartProps extends LineChartProps {
	stack?: boolean
}

export interface PieChartProps {
	title?: string
	description?: string
	data: Array<{ name: string; value: number }>
	colors?: string[]
	valueFormatter?: (value: number) => string
	className?: string
	showLegend?: boolean
	showTooltip?: boolean
	innerRadius?: number
	outerRadius?: number
}


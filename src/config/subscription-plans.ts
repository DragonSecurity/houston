export type PlanFeature = {
	title: string
	description: string
	included: boolean
}

export type PlanLimit = {
	name: string
	title: string
	value: number
	unit: string
}

export type SubscriptionPlan = {
	id: string
	name: string
	description: string
	features: PlanFeature[]
	limits: Record<string, PlanLimit>
	monthlyPrice: number // in cents
	annualPrice: number // in cents
	stripePriceIdMonthly: string
	stripePriceIdAnnual: string
	popular?: boolean
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
	{
		id: "free",
		name: "Free",
		description: "For individuals just getting started",
		features: [
			{ title: "Basic analytics", description: "Simple usage statistics", included: true },
			{ title: "Standard support", description: "Email support with 48h response time", included: true },
			{ title: "Single user", description: "No team collaboration", included: true },
			{ title: "Advanced analytics", description: "Detailed insights and reports", included: false },
			{ title: "Priority support", description: "Email support with 24h response time", included: false },
			{ title: "Team collaboration", description: "Work together with your team", included: false },
		],
		limits: {
			api_calls: {
				name: "api_calls",
				title: "API Calls",
				value: 1000,
				unit: "calls/month",
			},
			storage: {
				name: "storage",
				title: "Storage",
				value: 5,
				unit: "GB",
			},
			exports: {
				name: "exports",
				title: "Exports",
				value: 5,
				unit: "per month",
			},
		},
		monthlyPrice: 0,
		annualPrice: 0,
		stripePriceIdMonthly: "",
		stripePriceIdAnnual: "",
	},
	{
		id: "pro",
		name: "Pro",
		description: "For professionals and small teams",
		popular: true,
		features: [
			{ title: "Basic analytics", description: "Simple usage statistics", included: true },
			{ title: "Standard support", description: "Email support with 48h response time", included: true },
			{ title: "Single user", description: "No team collaboration", included: true },
			{ title: "Advanced analytics", description: "Detailed insights and reports", included: true },
			{ title: "Priority support", description: "Email support with 24h response time", included: true },
			{ title: "Team collaboration", description: "Work together with your team", included: false },
		],
		limits: {
			api_calls: {
				name: "api_calls",
				title: "API Calls",
				value: 10000,
				unit: "calls/month",
			},
			storage: {
				name: "storage",
				title: "Storage",
				value: 20,
				unit: "GB",
			},
			exports: {
				name: "exports",
				title: "Exports",
				value: 20,
				unit: "per month",
			},
		},
		monthlyPrice: 1999,
		annualPrice: 19990, // ~$16.66/month, saving ~17%
		stripePriceIdMonthly: "price_monthly_pro",
		stripePriceIdAnnual: "price_annual_pro",
	},
	{
		id: "business",
		name: "Business",
		description: "For businesses with advanced needs",
		features: [
			{ title: "Basic analytics", description: "Simple usage statistics", included: true },
			{ title: "Standard support", description: "Email support with 48h response time", included: true },
			{ title: "Single user", description: "No team collaboration", included: true },
			{ title: "Advanced analytics", description: "Detailed insights and reports", included: true },
			{ title: "Priority support", description: "Email support with 24h response time", included: true },
			{ title: "Team collaboration", description: "Work together with your team", included: true },
		],
		limits: {
			api_calls: {
				name: "api_calls",
				title: "API Calls",
				value: 100000,
				unit: "calls/month",
			},
			storage: {
				name: "storage",
				title: "Storage",
				value: 100,
				unit: "GB",
			},
			exports: {
				name: "exports",
				title: "Exports",
				value: 100,
				unit: "per month",
			},
		},
		monthlyPrice: 4999,
		annualPrice: 47990, // ~$39.99/month, saving ~20%
		stripePriceIdMonthly: "price_monthly_business",
		stripePriceIdAnnual: "price_annual_business",
	},
]

export const getPlanById = (id: string): SubscriptionPlan | undefined => {
	return SUBSCRIPTION_PLANS.find((plan) => plan.id === id)
}

export const getAnnualSavingsPercentage = (plan: SubscriptionPlan): number => {
	if (plan.monthlyPrice === 0) return 0
	const monthlyCostForYear = plan.monthlyPrice * 12
	const savings = monthlyCostForYear - plan.annualPrice
	return Math.round((savings / monthlyCostForYear) * 100)
}

export const formatPrice = (price: number): string => {
	return `$${(price / 100).toFixed(2)}`
}


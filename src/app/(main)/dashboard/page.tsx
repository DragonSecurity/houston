import { Suspense } from "react"
import { DashboardStats } from "@/components/dashboard/stats"
import { UsageChart } from "@/components/dashboard/usage-chart"
import { RevenueChart } from "@/components/dashboard/revenue-chart"
import { SubscriptionDistribution } from "@/components/dashboard/subscription-distribution"
import { UserGrowthChart } from "@/components/dashboard/user-growth-chart"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { Skeleton } from "@/components/ui/skeleton"
import { ErrorBoundary } from "@/components/error-boundary"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
	// Get the current user from the auth session using getServerSession
	const session = await getServerSession(authOptions)

	if (!session?.user) {
		redirect("/signin")
	}

	const userId = session.user.id

	return (
		<div className="container py-10">
			<h1 className="text-3xl font-bold mb-6">Dashboard</h1>

			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
				<ErrorBoundary>
					<DashboardStats />
				</ErrorBoundary>
			</div>

			<div className="grid gap-6 md:grid-cols-2 mb-8">
				<ErrorBoundary>
					<Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
						<UsageChart userId={userId} />
					</Suspense>
				</ErrorBoundary>

				<ErrorBoundary>
					<Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
						<RevenueChart />
					</Suspense>
				</ErrorBoundary>
			</div>

			<div className="grid gap-6 md:grid-cols-2 mb-8">
				<ErrorBoundary>
					<Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
						<SubscriptionDistribution />
					</Suspense>
				</ErrorBoundary>

				<ErrorBoundary>
					<Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
						<UserGrowthChart />
					</Suspense>
				</ErrorBoundary>
			</div>
		</div>
	)
}


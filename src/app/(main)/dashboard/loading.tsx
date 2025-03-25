import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardLoading() {
	return (
		<div className="container py-10">
			<Skeleton className="h-10 w-48 mb-6" />

			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
				{Array(4)
					.fill(0)
					.map((_, i) => (
						<Skeleton key={i} className="h-[120px] w-full" />
					))}
			</div>

			<div className="grid gap-6 md:grid-cols-2 mb-8">
				<Skeleton className="h-[400px] w-full" />
				<Skeleton className="h-[400px] w-full" />
			</div>
		</div>
	)
}


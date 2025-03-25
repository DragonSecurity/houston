import { Separator } from "@/components/ui/separator"

export function BillingHeader() {
	return (
		<div className="space-y-4">
			<div>
				<h1 className="text-2xl font-bold tracking-tight">Billing & Subscription</h1>
				<p className="text-muted-foreground">Manage your subscription, payment methods, and billing history</p>
			</div>
			<Separator />
		</div>
	)
}


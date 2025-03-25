"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface UpcomingInvoiceProps {
	subscriptionId: string
	customerId: string
}

export function UpcomingInvoice({ subscriptionId, customerId }: UpcomingInvoiceProps) {
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	return (
		<Card>
			<CardHeader>
				<CardTitle>Upcoming Invoice</CardTitle>
				<CardDescription>Your next billing charge</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="text-center py-4">
					<p className="text-sm text-muted-foreground">View your upcoming invoice in the billing portal</p>
				</div>
			</CardContent>
		</Card>
	)
}


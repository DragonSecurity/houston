"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { formatPrice } from "@/config/subscription-plans"

interface UpcomingInvoiceProps {
	subscriptionId: string
	customerId: string
}

interface UpcomingInvoice {
	amount_due: number
	period_end: number
	lines: {
		data: Array<{
			description: string
			amount: number
		}>
	}
}

export function UpcomingInvoice({ subscriptionId, customerId }: UpcomingInvoiceProps) {
	const [invoice, setInvoice] = useState<UpcomingInvoice | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const fetchUpcomingInvoice = async () => {
			try {
				const response = await fetch(
					`/api/subscription/upcoming-invoice?subscriptionId=${subscriptionId}&customerId=${customerId}`,
				)

				if (!response.ok) {
					throw new Error("Failed to fetch upcoming invoice")
				}

				const data = await response.json()
				setInvoice(data.invoice)
			} catch (error) {
				console.error("Error fetching upcoming invoice:", error)
				setError("Failed to load upcoming invoice")
			} finally {
				setIsLoading(false)
			}
		}

		fetchUpcomingInvoice()
	}, [subscriptionId, customerId])

	const formatDate = (timestamp: number) => {
		return new Intl.DateTimeFormat("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		}).format(new Date(timestamp * 1000))
	}

	if (isLoading) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Upcoming Invoice</CardTitle>
					<CardDescription>Your next billing charge</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						<Skeleton className="h-4 w-32" />
						<Skeleton className="h-4 w-24" />
						<div className="pt-2">
							<Skeleton className="h-5 w-40" />
						</div>
					</div>
				</CardContent>
			</Card>
		)
	}

	if (error || !invoice) {
		return null
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Upcoming Invoice</CardTitle>
				<CardDescription>Your next billing charge</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					<div>
						<p className="text-sm text-muted-foreground">Next billing date</p>
						<p className="font-medium">{formatDate(invoice.period_end)}</p>
					</div>

					{invoice.lines.data.length > 0 && (
						<div>
							<p className="text-sm text-muted-foreground">Subscription items</p>
							<ul className="mt-1 space-y-1">
								{invoice.lines.data.map((item, index) => (
									<li key={index} className="text-sm flex justify-between">
										<span>{item.description}</span>
										<span>{formatPrice(item.amount / 100)}</span>
									</li>
								))}
							</ul>
						</div>
					)}

					<div className="pt-2 border-t">
						<div className="flex justify-between items-center">
							<p className="font-medium">Total due</p>
							<p className="font-bold text-lg">{formatPrice(invoice.amount_due / 100)}</p>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	)
}


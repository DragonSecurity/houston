"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Download, ExternalLink } from "lucide-react"
import { formatPrice } from "@/config/subscription-plans"

interface Invoice {
	id: string
	number: string
	amount_paid: number
	status: string
	created: number
	hosted_invoice_url: string
	invoice_pdf: string
}

interface BillingHistoryProps {
	customerId: string
}

export function BillingHistory({ customerId }: BillingHistoryProps) {
	const [invoices, setInvoices] = useState<Invoice[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const fetchInvoices = async () => {
			try {
				const response = await fetch(`/api/subscription/invoices?customerId=${customerId}`)

				if (!response.ok) {
					throw new Error("Failed to fetch invoices")
				}

				const data = await response.json()
				setInvoices(data.invoices)
			} catch (error) {
				console.error("Error fetching invoices:", error)
				setError("Failed to load billing history")
			} finally {
				setIsLoading(false)
			}
		}

		fetchInvoices()
	}, [customerId])

	const formatDate = (timestamp: number) => {
		return new Intl.DateTimeFormat("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		}).format(new Date(timestamp * 1000))
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Billing History</CardTitle>
				<CardDescription>View and download your past invoices</CardDescription>
			</CardHeader>
			<CardContent>
				{isLoading ? (
					<div className="space-y-4">
						{Array.from({ length: 3 }).map((_, i) => (
							<div key={i} className="flex items-center justify-between">
								<div className="space-y-2">
									<Skeleton className="h-4 w-32" />
									<Skeleton className="h-3 w-24" />
								</div>
								<Skeleton className="h-8 w-20" />
							</div>
						))}
					</div>
				) : error ? (
					<p className="text-sm text-muted-foreground">{error}</p>
				) : invoices.length === 0 ? (
					<p className="text-sm text-muted-foreground">No billing history available</p>
				) : (
					<div className="space-y-4">
						{invoices.map((invoice) => (
							<div key={invoice.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
								<div>
									<p className="font-medium">Invoice #{invoice.number}</p>
									<p className="text-sm text-muted-foreground">
										{formatDate(invoice.created)} • {formatPrice(invoice.amount_paid / 100)}
									</p>
								</div>
								<div className="flex space-x-2">
									<Button variant="outline" size="sm" asChild>
										<a href={invoice.invoice_pdf} target="_blank" rel="noopener noreferrer">
											<Download size={16} className="mr-1" />
											PDF
										</a>
									</Button>
									<Button variant="outline" size="sm" asChild>
										<a href={invoice.hosted_invoice_url} target="_blank" rel="noopener noreferrer">
											<ExternalLink size={16} className="mr-1" />
											View
										</a>
									</Button>
								</div>
							</div>
						))}
					</div>
				)}
			</CardContent>
		</Card>
	)
}


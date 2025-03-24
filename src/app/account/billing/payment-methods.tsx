"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { CreditCard, Plus } from "lucide-react"

interface PaymentMethod {
	id: string
	card: {
		brand: string
		last4: string
		exp_month: number
		exp_year: number
	}
	billing_details: {
		name: string | null
	}
	isDefault: boolean
}

interface PaymentMethodsProps {
	customerId: string
}

export function PaymentMethods({ customerId }: PaymentMethodsProps) {
	const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const fetchPaymentMethods = async () => {
			try {
				const response = await fetch(`/api/subscription/payment-methods?customerId=${customerId}`)

				if (!response.ok) {
					throw new Error("Failed to fetch payment methods")
				}

				const data = await response.json()
				setPaymentMethods(data.paymentMethods)
			} catch (error) {
				console.error("Error fetching payment methods:", error)
				setError("Failed to load payment methods")
			} finally {
				setIsLoading(false)
			}
		}

		fetchPaymentMethods()
	}, [customerId])

	const handleManagePaymentMethods = () => {
		window.location.href = "/api/subscription/portal"
	}

	const getCardIcon = (brand: string) => {
		// You could replace this with actual card brand icons
		return <CreditCard className="h-4 w-4 mr-2" />
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Payment Methods</CardTitle>
				<CardDescription>Manage your payment methods</CardDescription>
			</CardHeader>
			<CardContent>
				{isLoading ? (
					<div className="space-y-4">
						{Array.from({ length: 2 }).map((_, i) => (
							<div key={i} className="flex items-center space-x-4">
								<Skeleton className="h-10 w-10 rounded-full" />
								<div className="space-y-2">
									<Skeleton className="h-4 w-32" />
									<Skeleton className="h-3 w-24" />
								</div>
							</div>
						))}
					</div>
				) : error ? (
					<p className="text-sm text-muted-foreground">{error}</p>
				) : paymentMethods.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-4 text-center">
						<CreditCard className="h-10 w-10 text-muted-foreground mb-2" />
						<p className="text-sm text-muted-foreground">No payment methods found</p>
					</div>
				) : (
					<div className="space-y-4">
						{paymentMethods.map((method) => (
							<div key={method.id} className="flex items-center justify-between">
								<div className="flex items-center">
									{getCardIcon(method.card.brand)}
									<div>
										<p className="font-medium capitalize">
											{method.card.brand} •••• {method.card.last4}
											{method.isDefault && <span className="ml-2 text-xs text-green-600 font-normal">Default</span>}
										</p>
										<p className="text-xs text-muted-foreground">
											Expires {method.card.exp_month.toString().padStart(2, "0")}/{method.card.exp_year % 100}
										</p>
									</div>
								</div>
							</div>
						))}
					</div>
				)}
			</CardContent>
			<CardFooter>
				<Button onClick={handleManagePaymentMethods} className="w-full">
					<Plus size={16} className="mr-2" />
					Manage Payment Methods
				</Button>
			</CardFooter>
		</Card>
	)
}


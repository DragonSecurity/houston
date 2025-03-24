import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
	apiVersion: "2025-02-24.acacia",
})

export async function GET(req: NextRequest) {
	try {
		const session = await getServerSession(authOptions)

		if (!session?.user?.email) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
		}

		const url = new URL(req.url)
		const customerId = url.searchParams.get("customerId")

		if (!customerId) {
			return NextResponse.json({ error: "Customer ID is required" }, { status: 400 })
		}

		const paymentMethods = await stripe.paymentMethods.list({
			customer: customerId,
			type: "card",
		})

		// Get the default payment method from the customer
		const customer = await stripe.customers.retrieve(customerId)
		const defaultPaymentMethodId =
			typeof customer !== "string" ? customer.invoice_settings?.default_payment_method : null

		// Mark the default payment method
		const formattedPaymentMethods = paymentMethods.data.map((method) => ({
			...method,
			isDefault: method.id === defaultPaymentMethodId,
		}))

		return NextResponse.json({ paymentMethods: formattedPaymentMethods })
	} catch (error) {
		console.error("Error fetching payment methods:", error)
		return NextResponse.json({ error: "Failed to fetch payment methods" }, { status: 500 })
	}
}


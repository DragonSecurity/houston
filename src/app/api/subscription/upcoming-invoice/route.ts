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
		const subscriptionId = url.searchParams.get("subscriptionId")
		const customerId = url.searchParams.get("customerId")

		if (!subscriptionId || !customerId) {
			return NextResponse.json({ error: "Subscription ID and Customer ID are required" }, { status: 400 })
		}

		const invoice = await stripe.invoices.retrieveUpcoming({
			customer: customerId,
			subscription: subscriptionId,
		})

		return NextResponse.json({ invoice })
	} catch (error) {
		console.error("Error fetching upcoming invoice:", error)
		return NextResponse.json({ error: "Failed to fetch upcoming invoice" }, { status: 500 })
	}
}


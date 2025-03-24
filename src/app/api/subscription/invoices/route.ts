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

		const invoices = await stripe.invoices.list({
			customer: customerId,
			limit: 10,
			status: "paid",
		})

		return NextResponse.json({ invoices: invoices.data })
	} catch (error) {
		console.error("Error fetching invoices:", error)
		return NextResponse.json({ error: "Failed to fetch invoices" }, { status: 500 })
	}
}


import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendPasswordResetEmail } from "@/lib/email"
import crypto from "crypto"

export async function POST(request: Request) {
	try {
		const { email } = await request.json()

		if (!email) {
			return NextResponse.json({ error: "Email is required" }, { status: 400 })
		}

		const user = await prisma.user.findUnique({
			where: {
				email,
			},
		})

		// Always return success even if user doesn't exist (security best practice)
		if (!user) {
			return NextResponse.json({ success: true })
		}

		// Generate reset token
		const token = crypto.randomBytes(32).toString("hex")
		const expires = new Date(Date.now() + 1 * 60 * 60 * 1000) // 1 hour

		// Store token in database
		await prisma.passwordResetToken.create({
			data: {
				email,
				token,
				expires,
			},
		})

		// Send password reset email
		await sendPasswordResetEmail({ name: user.name || "User", email: user.email }, token)

		return NextResponse.json({ success: true })
	} catch (error) {
		console.error("Password reset request error:", error)
		return NextResponse.json({ error: "Failed to send password reset email" }, { status: 500 })
	}
}


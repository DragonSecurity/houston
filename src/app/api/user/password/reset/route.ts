import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { hash } from "bcrypt"

export async function POST(request: Request) {
	try {
		const { token, password } = await request.json()

		if (!token || !password) {
			return NextResponse.json({ error: "Token and password are required" }, { status: 400 })
		}

		// Find the reset token
		const resetToken = await prisma.passwordResetToken.findFirst({
			where: {
				token,
				expires: {
					gt: new Date(),
				},
			},
		})

		if (!resetToken) {
			return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 })
		}

		// Hash the new password
		const hashedPassword = await hash(password, 12)

		// Update user's password
		await prisma.user.update({
			where: {
				email: resetToken.email,
			},
			data: {
				password: hashedPassword,
			},
		})

		// Delete the used token
		await prisma.passwordResetToken.delete({
			where: {
				id: resetToken.id,
			},
		})

		return NextResponse.json({ success: true })
	} catch (error) {
		console.error("Password reset error:", error)
		return NextResponse.json({ error: "Failed to reset password" }, { status: 500 })
	}
}


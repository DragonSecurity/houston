import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { hash } from "bcrypt"
import { sendWelcomeEmail, sendVerificationEmail } from "@/lib/email"
import crypto from "crypto"

export async function POST(request: Request) {
	try {
		const data: {name: string, email: string, password: string} = await request.json()

		// Check if user already exists
		const existingUser = await prisma.user.findUnique({
			where: {
				email: data.email,
			},
		})

		if (existingUser) {
			return NextResponse.json({ error: "User already exists" }, { status: 400 })
		}

		// Hash password
		const hashedPassword = await hash(data.password, 12)

		// Create new user
		const user = await prisma.user.create({
			data: {
				name: data.name,
				email: data.email,
				password: hashedPassword,
				permission: "OWNER",
			},
		})

		// Create account for the user
		const account = await prisma.account.create({
			data: {
				userId: user.id,
				type: "credentials",
				provider: "credentials",
				providerAccountId: user.id,
			},
		})

		// Generate verification token
		const token = crypto.randomBytes(32).toString("hex")
		const expires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

		// Store token in database
		await prisma.verificationToken.create({
			data: {
				identifier: user.email,
				token,
				expires,
			},
		})

		// Send welcome and verification emails
		await sendWelcomeEmail({ name: data.name, email: user.email })
		await sendVerificationEmail({ name: data.name, email: user.email }, token)

		return NextResponse.json({
			data: {
				user,
				account,
			},
		})
	} catch (error) {
		console.error("Account creation error:", error)
		return NextResponse.json({ error: "Failed to create account" }, { status: 500 })
	}
}


import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { authenticator } from "otplib"
import crypto from "crypto"

// Schema for enabling 2FA
const enableSchema = z.object({
	code: z.string().length(6),
})

// Schema for disabling 2FA
const disableSchema = z.object({
	confirm: z.boolean().refine((val) => val === true, {
		message: "You must confirm this action",
	}),
})

// Get 2FA status
export async function GET() {
	try {
		const session = await getServerSession(authOptions)

		if (!session?.user?.email) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
		}

		// Get the user's 2FA settings
		const securitySettings = await prisma.securitySettings.findUnique({
			where: {
				userId: session.user.id,
			},
		})

		if (!securitySettings) {
			return NextResponse.json({
				enabled: false,
			})
		}

		return NextResponse.json({
			enabled: securitySettings.twoFactorEnabled,
			method: securitySettings.twoFactorMethod,
		})
	} catch (error) {
		console.error("Error fetching 2FA status:", error)
		return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
	}
}

// Generate new 2FA secret
export async function PUT() {
	try {
		const session = await getServerSession(authOptions)

		if (!session?.user?.email) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
		}

		// Generate a new secret
		const secret = authenticator.generateSecret()

		// Store the secret temporarily (not enabled yet)
		await prisma.securitySettings.upsert({
			where: {
				userId: session.user.id,
			},
			update: {
				twoFactorSecret: secret,
				twoFactorEnabled: false,
			},
			create: {
				userId: session.user.id,
				twoFactorSecret: secret,
				twoFactorEnabled: false,
				twoFactorMethod: "app",
			},
		})

		// Generate QR code data
		const otpauth = authenticator.keyuri(session.user.email, "Houston", secret)

		return NextResponse.json({
			secret,
			otpauth,
		})
	} catch (error) {
		console.error("Error generating 2FA secret:", error)
		return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
	}
}

// Enable 2FA
export async function POST(request: Request) {
	try {
		const session = await getServerSession(authOptions)

		if (!session?.user?.email) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
		}

		const body = await request.json()
		const validatedData = enableSchema.parse(body)

		// Get the user's security settings
		const securitySettings = await prisma.securitySettings.findUnique({
			where: {
				userId: session.user.id,
			},
		})

		if (!securitySettings || !securitySettings.twoFactorSecret) {
			return NextResponse.json({ error: "No 2FA setup in progress" }, { status: 400 })
		}

		// Verify the code
		const isValid = authenticator.verify({
			token: validatedData.code,
			secret: securitySettings.twoFactorSecret,
		})

		if (!isValid) {
			return NextResponse.json({ error: "Invalid verification code" }, { status: 400 })
		}

		// Generate backup codes
		const backupCodes = Array(10)
			.fill(0)
			.map(() => crypto.randomBytes(4).toString("hex"))

		// Enable 2FA
		await prisma.securitySettings.update({
			where: {
				userId: session.user.id,
			},
			data: {
				twoFactorEnabled: true,
				backupCodes: JSON.stringify(backupCodes),
			},
		})

		// Update user record
		await prisma.user.update({
			where: {
				id: session.user.id,
			},
			data: {
				twoFactorEnabled: true,
			},
		})

		// Log the activity
		await prisma.activity.create({
			data: {
				userId: session.user.id,
				type: "LOGIN",
				metadata: { action: "2fa_enabled" },
				ipAddress: request.headers.get("x-forwarded-for") || null,
				userAgent: request.headers.get("user-agent") || null,
			},
		})

		return NextResponse.json({
			success: true,
			backupCodes,
		})
	} catch (error) {
		console.error("Error enabling 2FA:", error)
		if (error instanceof z.ZodError) {
			return NextResponse.json({ error: error.errors }, { status: 400 })
		}
		return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
	}
}

// Disable 2FA
export async function DELETE(request: Request) {
	try {
		const session = await getServerSession(authOptions)

		if (!session?.user?.email) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
		}

		const body = await request.json()
		const validatedData = disableSchema.parse(body)

		// Disable 2FA
		await prisma.securitySettings.update({
			where: {
				userId: session.user.id,
			},
			data: {
				twoFactorEnabled: false,
				twoFactorSecret: null,
				backupCodes: null,
			},
		})

		// Update user record
		await prisma.user.update({
			where: {
				id: session.user.id,
			},
			data: {
				twoFactorEnabled: false,
			},
		})

		// Log the activity
		await prisma.activity.create({
			data: {
				userId: session.user.id,
				type: "LOGIN",
				metadata: { action: "2fa_disabled" },
				ipAddress: request.headers.get("x-forwarded-for") || null,
				userAgent: request.headers.get("user-agent") || null,
			},
		})

		return NextResponse.json({ success: true })
	} catch (error) {
		console.error("Error disabling 2FA:", error)
		if (error instanceof z.ZodError) {
			return NextResponse.json({ error: error.errors }, { status: 400 })
		}
		return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
	}
}


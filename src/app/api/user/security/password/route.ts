import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { hash, compare } from "bcrypt"

const passwordSchema = z.object({
	currentPassword: z.string().min(1),
	newPassword: z.string().min(8),
})

export async function POST(request: Request) {
	try {
		const session = await getServerSession(authOptions)

		if (!session?.user?.email) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
		}

		const body = await request.json()
		const validatedData = passwordSchema.parse(body)

		// Get the user with their current password
		const user = await prisma.user.findUnique({
			where: {
				email: session.user.email,
			},
			select: {
				id: true,
				password: true,
			},
		})

		if (!user || !user.password) {
			return NextResponse.json({ error: "User not found or no password set" }, { status: 404 })
		}

		// Verify current password
		const isPasswordValid = await compare(validatedData.currentPassword, user.password)
		if (!isPasswordValid) {
			return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 })
		}

		// Hash the new password
		const hashedPassword = await hash(validatedData.newPassword, 12)

		// Update the user's password
		await prisma.user.update({
			where: {
				id: user.id,
			},
			data: {
				password: hashedPassword,
			},
		})

		// Update security settings if they exist
		const securitySettings = await prisma.securitySettings.findUnique({
			where: {
				userId: user.id,
			},
		})

		if (securitySettings) {
			await prisma.securitySettings.update({
				where: {
					userId: user.id,
				},
				data: {
					lastPasswordChange: new Date(),
				},
			})
		} else {
			await prisma.securitySettings.create({
				data: {
					userId: user.id,
					lastPasswordChange: new Date(),
				},
			})
		}

		// Log the activity
		await prisma.activity.create({
			data: {
				userId: user.id,
				type: "PASSWORD_CHANGE",
				ipAddress: request.headers.get("x-forwarded-for") || null,
				userAgent: request.headers.get("user-agent") || null,
			},
		})

		return NextResponse.json({ success: true })
	} catch (error) {
		console.error("Error changing password:", error)
		if (error instanceof z.ZodError) {
			return NextResponse.json({ error: error.errors }, { status: 400 })
		}
		return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
	}
}


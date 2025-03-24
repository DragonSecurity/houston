import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import * as z from "zod"

const profileSchema = z.object({
	name: z
		.string()
		.min(2, {
			message: "Name must be at least 2 characters.",
		})
		.max(30, {
			message: "Name must not be longer than 30 characters.",
		}),
	email: z.string().email({
		message: "Please enter a valid email address.",
	}),
})

export async function PATCH(req: NextRequest) {
	try {
		const session = await getServerSession(authOptions)

		if (!session?.user?.email) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
		}

		const body = await req.json()
		const validatedData = profileSchema.parse(body)

		// Check if email is being changed
		if (validatedData.email !== session.user.email) {
			// Check if the new email is already in use
			const existingUser = await prisma.user.findUnique({
				where: { email: validatedData.email },
			})

			if (existingUser) {
				return NextResponse.json({ error: "Email already in use" }, { status: 400 })
			}
		}

		// Update user profile
		await prisma.user.update({
			where: { email: session.user.email },
			data: {
				name: validatedData.name,
				// Only update email if it's different
				...(validatedData.email !== session.user.email && {
					email: validatedData.email,
					emailVerified: null, // Require re-verification if email changes
				}),
			},
		})

		return NextResponse.json({ success: true })
	} catch (error) {
		console.error("Error updating profile:", error)
		return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
	}
}


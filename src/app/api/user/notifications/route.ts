import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const notificationSchema = z.object({
	emailPrefs: z.object({
		marketing: z.boolean().default(false),
		social: z.boolean().default(false),
		security: z.boolean().default(false),
		updates: z.boolean().default(false),
		newsletter: z.boolean().default(false),
	}),
	pushPrefs: z.object({
		marketing: z.boolean().default(false),
		social: z.boolean().default(false),
		security: z.boolean().default(false),
		updates: z.boolean().default(false),
		newsletter: z.boolean().default(false),
	}),
})

export async function GET() {
	try {
		const session = await getServerSession(authOptions)

		if (!session?.user?.email) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
		}

		// Get user preferences or create default ones if they don't exist
		const userPreferences = await prisma.userPreferences.findUnique({
			where: {
				userId: session.user.id,
			},
		})

		if (!userPreferences) {
			return NextResponse.json({
				emailPrefs: {
					marketing: true,
					social: true,
					security: true,
					updates: true,
					newsletter: true,
				},
				pushPrefs: {
					marketing: true,
					social: true,
					security: true,
					updates: true,
					newsletter: true,
				},
			})
		}

		// Map database preferences to frontend format
		return NextResponse.json({
			emailPrefs: {
				marketing: userPreferences.marketingEmails,
				social: userPreferences.socialEmails,
				security: userPreferences.securityAlerts,
				updates: userPreferences.productUpdates,
				newsletter: userPreferences.newsletterEmails,
			},
			pushPrefs: {
				marketing: userPreferences.marketingNotifications,
				social: userPreferences.socialNotifications,
				security: userPreferences.securityNotifications,
				updates: userPreferences.updateNotifications,
				newsletter: userPreferences.newsletterNotifications,
			},
		})
	} catch (error) {
		console.error("Error fetching notification preferences:", error)
		return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
	}
}

export async function POST(request: Request) {
	try {
		const session = await getServerSession(authOptions)

		if (!session?.user?.email) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
		}

		const body = await request.json()
		const validatedData = notificationSchema.parse(body)

		// Update or create user preferences
		const userPreferences = await prisma.userPreferences.upsert({
			where: {
				userId: session.user.id,
			},
			update: {
				emailNotifications: true, // Always on if they're setting preferences
				marketingEmails: validatedData.emailPrefs.marketing,
				securityAlerts: validatedData.emailPrefs.security,
				productUpdates: validatedData.emailPrefs.updates,
				newsletterEmails: validatedData.emailPrefs.newsletter,
				socialEmails: validatedData.emailPrefs.social,
				marketingNotifications: validatedData.pushPrefs.marketing,
				socialNotifications: validatedData.pushPrefs.social,
				securityNotifications: validatedData.pushPrefs.security,
				updateNotifications: validatedData.pushPrefs.updates,
				newsletterNotifications: validatedData.pushPrefs.newsletter
			},
			create: {
				userId: session.user.id,
				emailNotifications: true,
				marketingEmails: validatedData.emailPrefs.marketing,
				securityAlerts: validatedData.emailPrefs.security,
				productUpdates: validatedData.emailPrefs.updates,
				newsletterEmails: validatedData.emailPrefs.newsletter,
				socialEmails: validatedData.emailPrefs.social,
				marketingNotifications: validatedData.pushPrefs.marketing,
				socialNotifications: validatedData.pushPrefs.social,
				securityNotifications: validatedData.pushPrefs.security,
				updateNotifications: validatedData.pushPrefs.updates,
				newsletterNotifications: validatedData.pushPrefs.newsletter
			},
		})

		return NextResponse.json({ success: true })
	} catch (error) {
		console.error("Error updating notification preferences:", error)
		if (error instanceof z.ZodError) {
			return NextResponse.json({ error: error.errors }, { status: 400 })
		}
		return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
	}
}


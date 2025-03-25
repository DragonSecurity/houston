import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const preferencesSchema = z.object({
	theme: z.enum(["light", "dark", "system"]),
	language: z.string(),
	timezone: z.string(),
	dateFormat: z.string(),
	compactMode: z.boolean(),
	animations: z.boolean(),
	autoSave: z.boolean(),
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
			// Return default preferences
			return NextResponse.json({
				theme: "system",
				language: "english",
				timezone: "auto",
				dateFormat: "MM/DD/YYYY",
				compactMode: false,
				animations: true,
				autoSave: true,
			})
		}

		// Map database preferences to frontend format
		return NextResponse.json({
			theme: userPreferences.theme || "system",
			language: userPreferences.language || "english",
			timezone: "auto", // Default since it's not in the schema
			dateFormat: "MM/DD/YYYY", // Default since it's not in the schema
			compactMode: false, // Default since it's not in the schema
			animations: true, // Default since it's not in the schema
			autoSave: true, // Default since it's not in the schema
		})
	} catch (error) {
		console.error("Error fetching preferences:", error)
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
		const validatedData = preferencesSchema.parse(body)

		// Update or create user preferences
		const userPreferences = await prisma.userPreferences.upsert({
			where: {
				userId: session.user.id,
			},
			update: {
				theme: validatedData.theme,
				language: validatedData.language,
			},
			create: {
				userId: session.user.id,
				theme: validatedData.theme,
				language: validatedData.language,
			},
		})

		return NextResponse.json(userPreferences)
	} catch (error) {
		console.error("Error updating preferences:", error)
		if (error instanceof z.ZodError) {
			return NextResponse.json({ error: error.errors }, { status: 400 })
		}
		return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
	}
}


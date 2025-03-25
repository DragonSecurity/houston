import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import crypto from "crypto"

const apiKeySchema = z.object({
	name: z.string().min(1, "Name is required"),
	scope: z.string().min(1, "Scope is required"),
})

// Get all API keys for the user
export async function GET() {
	try {
		const session = await getServerSession(authOptions)

		if (!session?.user?.email) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
		}

		const apiKeys = await prisma.apiKey.findMany({
			where: {
				userId: session.user.id,
			},
			orderBy: {
				createdAt: "desc",
			},
		})

		// Format the API keys for the frontend
		const formattedKeys = apiKeys.map((key) => {
			return {
				id: key.id,
				name: key.name,
				scope: key.permissions[0] || "read", // Assuming the first permission is the scope
				lastUsed: key.lastUsed ? new Date(key.lastUsed).toISOString() : "Never",
				created: new Date(key.createdAt).toISOString(),
			}
		})

		return NextResponse.json({ apiKeys: formattedKeys })
	} catch (error) {
		console.error("Error fetching API keys:", error)
		return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
	}
}

// Create a new API key
export async function POST(request: Request) {
	try {
		const session = await getServerSession(authOptions)

		if (!session?.user?.email) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
		}

		const body = await request.json()
		const validatedData = apiKeySchema.parse(body)

		// Generate a new API key
		const apiKey = `sk_${crypto.randomBytes(24).toString("hex")}`

		// Determine permissions based on scope
		let permissions: string[] = []
		switch (validatedData.scope) {
			case "read":
				permissions = ["read"]
				break
			case "write":
				permissions = ["read", "write"]
				break
			case "admin":
				permissions = ["read", "write", "admin"]
				break
			default:
				permissions = ["read"]
		}

		// Create the API key
		const newKey = await prisma.apiKey.create({
			data: {
				userId: session.user.id,
				name: validatedData.name,
				key: apiKey,
				permissions,
			},
		})

		// Log the activity
		await prisma.activity.create({
			data: {
				userId: session.user.id,
				type: "API_KEY_CREATED",
				metadata: { keyId: newKey.id, name: validatedData.name },
				ipAddress: request.headers.get("x-forwarded-for") || null,
				userAgent: request.headers.get("user-agent") || null,
			},
		})

		return NextResponse.json({
			id: newKey.id,
			key: apiKey,
			name: newKey.name,
			scope: validatedData.scope,
			created: new Date(newKey.createdAt).toISOString(),
		})
	} catch (error) {
		console.error("Error creating API key:", error)
		if (error instanceof z.ZodError) {
			return NextResponse.json({ error: error.errors }, { status: 400 })
		}
		return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
	}
}

// Revoke an API key
export async function DELETE(request: Request) {
	try {
		const session = await getServerSession(authOptions)

		if (!session?.user?.email) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
		}

		const { searchParams } = new URL(request.url)
		const keyId = searchParams.get("id")

		if (!keyId) {
			return NextResponse.json({ error: "API key ID is required" }, { status: 400 })
		}

		// Verify the API key belongs to the user
		const apiKey = await prisma.apiKey.findUnique({
			where: {
				id: keyId,
			},
			select: {
				userId: true,
				name: true,
			},
		})

		if (!apiKey || apiKey.userId !== session.user.id) {
			return NextResponse.json({ error: "API key not found or not authorized" }, { status: 404 })
		}

		// Delete the API key
		await prisma.apiKey.delete({
			where: {
				id: keyId,
			},
		})

		// Log the activity
		await prisma.activity.create({
			data: {
				userId: session.user.id,
				type: "API_KEY_DELETED",
				metadata: { keyId, name: apiKey.name },
				ipAddress: request.headers.get("x-forwarded-for") || null,
				userAgent: request.headers.get("user-agent") || null,
			},
		})

		return NextResponse.json({ success: true })
	} catch (error) {
		console.error("Error revoking API key:", error)
		return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
	}
}


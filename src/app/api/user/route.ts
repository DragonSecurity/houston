import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
	const session = await getServerSession(authOptions)

	if (!session) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
	}

	try {
		const user = await prisma.user.findUnique({
			where: {
				email: session.user?.email as string,
			},
			include: {
				accounts: true,
			},
		})

		return NextResponse.json({ data: user })
	} catch (error) {
		return NextResponse.json({ error: "Failed to fetch user data" }, { status: 500 })
	}
}

export async function PATCH(request: Request) {
	const session = await getServerSession(authOptions)

	if (!session) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
	}

	try {
		const data = await request.json()

		const updatedUser = await prisma.user.update({
			where: {
				email: session.user?.email as string,
			},
			data: {
				name: data.name,
				image: data.avatar,
				// Add other fields as needed
			},
		})

		// Similarly, check for and remove references to onboardingCompleted here if needed

		return NextResponse.json({ data: updatedUser })
	} catch (error) {
		return NextResponse.json({ error: "Failed to update user data" }, { status: 500 })
	}
}


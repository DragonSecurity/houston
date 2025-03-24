import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Separator } from "@/components/ui/separator"
import { ProfileForm } from "./profile-form"

export const metadata = {
	title: "Profile",
	description: "Manage your profile information",
}

export default async function ProfilePage() {
	const session = await getServerSession(authOptions)

	if (!session?.user?.email) {
		redirect("/login")
	}

	const user = await prisma.user.findUnique({
		where: { email: session.user.email },
		select: {
			id: true,
			name: true,
			email: true,
			image: true,
		},
	})

	if (!user) {
		redirect("/login")
	}

	return (
		<div className="space-y-6">
			<div>
				<h3 className="text-lg font-medium">Profile</h3>
				<p className="text-sm text-muted-foreground">Manage your profile information and settings</p>
			</div>
			<Separator />
			<ProfileForm user={user} />
		</div>
	)
}


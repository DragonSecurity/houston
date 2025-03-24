"use client"

import { useSession } from "next-auth/react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { User, Lock, Fingerprint, CreditCard, Bell, Key, Users } from "lucide-react"

export function AccountView() {
	const { data: session } = useSession()
	const user = session?.user

	// Mock permission check - in a real app, this would come from the user's session
	const isOwner = true
	const isAdmin = true
	const isDeveloper = true

	const accountCards = [
		{
			title: "Profile",
			description: "Update your profile information",
			icon: <User className="h-5 w-5" />,
			href: "/account/profile",
			permission: "user",
		},
		{
			title: "Password",
			description: "Change your password",
			icon: <Lock className="h-5 w-5" />,
			href: "/account/password",
			permission: "user",
		},
		{
			title: "Two-Factor Authentication",
			description: "Secure your account",
			icon: <Fingerprint className="h-5 w-5" />,
			href: "/account/2fa",
			permission: "user",
		},
		{
			title: "Billing",
			description: "Update your plan or credit card",
			icon: <CreditCard className="h-5 w-5" />,
			href: "/account/billing",
			permission: "owner",
		},
		{
			title: "Notifications",
			description: "Choose which notifications you receive",
			icon: <Bell className="h-5 w-5" />,
			href: "/account/notifications",
			permission: "user",
		},
		{
			title: "API Keys",
			description: "Manage your API keys",
			icon: <Key className="h-5 w-5" />,
			href: "/account/apikeys",
			permission: "developer",
		},
		{
			title: "Users",
			description: "Invite users to your account",
			icon: <Users className="h-5 w-5" />,
			href: "/account/users",
			permission: "admin",
		},
	]

	// Filter cards based on user permissions
	const filteredCards = accountCards.filter((card) => {
		if (card.permission === "owner" && !isOwner) return false
		if (card.permission === "admin" && !isAdmin) return false
		if (card.permission === "developer" && !isDeveloper) return false
		return true
	})

	return (
		<div className="container mx-auto p-6 space-y-6">
			<h1 className="text-3xl font-bold">Your Account</h1>

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				{filteredCards.map((card, index) => (
					<Link href={card.href} key={index} className="block">
						<Card className="h-full transition-all hover:shadow-md">
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-lg font-medium">{card.title}</CardTitle>
								<div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">{card.icon}</div>
							</CardHeader>
							<CardContent>
								<CardDescription>{card.description}</CardDescription>
								<Button variant="outline" size="sm" className="mt-4">
									Manage
								</Button>
							</CardContent>
						</Card>
					</Link>
				))}
			</div>
		</div>
	)
}


"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { User, CreditCard, Settings, Bell, Shield, Key } from "lucide-react"

const navItems = [
	{
		title: "Profile",
		href: "/account/profile",
		icon: User,
	},
	{
		title: "Billing",
		href: "/account/billing",
		icon: CreditCard,
	},
	{
		title: "Notifications",
		href: "/account/notifications",
		icon: Bell,
	},
	{
		title: "Security",
		href: "/account/security",
		icon: Shield,
	},
	{
		title: "API Keys",
		href: "/account/api-keys",
		icon: Key,
	},
	{
		title: "Preferences",
		href: "/account/preferences",
		icon: Settings,
	},
]

export function AccountSidebar() {
	const pathname = usePathname()

	return (
		<nav className="flex flex-col space-y-1">
			{navItems.map((item) => {
				const isActive = pathname === item.href

				return (
					<Button
						key={item.href}
						variant={isActive ? "secondary" : "ghost"}
						className={cn("justify-start", isActive ? "bg-secondary" : "hover:bg-transparent hover:underline")}
						asChild
					>
						<Link href={item.href}>
							<item.icon className="mr-2 h-4 w-4" />
							{item.title}
						</Link>
					</Button>
				)
			})}
		</nav>
	)
}


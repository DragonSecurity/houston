"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { User, CreditCard, Settings, Bell, Shield, Key, Menu, ChevronLeft } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

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

export function AccountMobileNav() {
	const pathname = usePathname()
	const [open, setOpen] = useState(false)

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>
				<Button variant="outline" size="icon" className="md:hidden">
					<Menu className="h-5 w-5" />
					<span className="sr-only">Toggle account menu</span>
				</Button>
			</SheetTrigger>
			<SheetContent side="left">
				<SheetHeader className="mb-4">
					<SheetTitle>Account Settings</SheetTitle>
				</SheetHeader>
				<div className="flex items-center mb-4">
					<Link
						href="/dashboard"
						className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
						onClick={() => setOpen(false)}
					>
						<ChevronLeft className="mr-1 h-4 w-4" />
						Back to Dashboard
					</Link>
				</div>
				<nav className="flex flex-col space-y-2">
					{navItems.map((item) => {
						const isActive = pathname === item.href

						return (
							<Button
								key={item.href}
								variant={isActive ? "secondary" : "ghost"}
								className={cn("justify-start", isActive ? "bg-secondary" : "hover:bg-transparent hover:underline")}
								asChild
								onClick={() => setOpen(false)}
							>
								<Link href={item.href}>
									<item.icon className="mr-2 h-4 w-4" />
									{item.title}
								</Link>
							</Button>
						)
					})}
				</nav>
			</SheetContent>
		</Sheet>
	)
}


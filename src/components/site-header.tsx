"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import { LayoutDashboard, BarChart, Settings, LogOut, User, CreditCard, Menu, X } from "lucide-react"
import { useState } from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ThemeToggle } from "@/components/theme-toggle"

const mainNavItems = [
	{
		title: "Dashboard",
		href: "/dashboard",
		icon: LayoutDashboard,
	},
	{
		title: "Analytics",
		href: "/analytics",
		icon: BarChart,
	},
	{
		title: "Settings",
		href: "/settings",
		icon: Settings,
	},
]

export function SiteHeader() {
	const { data: session } = useSession()
	const pathname = usePathname()
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

	return (
		<header className="sticky top-0 z-40 w-full border-b bg-background">
			<div className="container flex h-14 items-center">
				<div className="mr-4 flex">
					<Link href="/" className="mr-6 flex items-center space-x-2">
						<span className="font-bold">Houston</span>
					</Link>

					{/* Mobile menu button */}
					<Button variant="ghost" className="md:hidden" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
						{mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
						<span className="sr-only">Toggle menu</span>
					</Button>
				</div>

				{/* Desktop navigation */}
				<nav className="hidden md:flex md:flex-1">
					<ul className="flex items-center gap-6">
						{mainNavItems.map((item) => (
							<li key={item.href}>
								<Link
									href={item.href}
									className={cn(
										"flex items-center text-sm font-medium transition-colors hover:text-primary",
										pathname === item.href || pathname?.startsWith(`${item.href}/`)
											? "text-foreground"
											: "text-foreground/60",
									)}
								>
									<item.icon className="mr-2 h-4 w-4" />
									{item.title}
								</Link>
							</li>
						))}
					</ul>
				</nav>

				{/* Mobile navigation */}
				{mobileMenuOpen && (
					<div className="fixed inset-0 top-14 z-50 grid h-[calc(100vh-3.5rem)] grid-flow-row auto-rows-max overflow-auto p-6 pb-32 shadow-md animate-in slide-in-from-bottom-80 md:hidden">
						<div className="relative z-20 grid gap-6 rounded-md bg-popover p-4 text-popover-foreground shadow-md">
							<nav className="grid grid-flow-row auto-rows-max text-sm">
								{mainNavItems.map((item) => (
									<Link
										key={item.href}
										href={item.href}
										className={cn(
											"flex w-full items-center rounded-md p-2 text-sm font-medium hover:underline",
											pathname === item.href ? "bg-muted" : "hover:bg-transparent",
										)}
										onClick={() => setMobileMenuOpen(false)}
									>
										<item.icon className="mr-2 h-4 w-4" />
										{item.title}
									</Link>
								))}
								{session?.user && (
									<>
										<Link
											href="/account"
											className="flex w-full items-center rounded-md p-2 text-sm font-medium hover:underline"
											onClick={() => setMobileMenuOpen(false)}
										>
											<User className="mr-2 h-4 w-4" />
											Account
										</Link>
										<Link
											href="/account/billing"
											className="flex w-full items-center rounded-md p-2 text-sm font-medium hover:underline"
											onClick={() => setMobileMenuOpen(false)}
										>
											<CreditCard className="mr-2 h-4 w-4" />
											Billing
										</Link>
									</>
								)}
							</nav>
						</div>
					</div>
				)}

				<div className="flex flex-1 items-center justify-end space-x-4">
					<nav className="flex items-center space-x-2">
						<ThemeToggle />

						{session?.user ? (
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="ghost" className="relative h-8 w-8 rounded-full">
										<span className="sr-only">Open user menu</span>
										<div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
											{session.user.name?.[0] || session.user.email?.[0] || "U"}
										</div>
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end">
									<DropdownMenuLabel>
										<div className="flex flex-col space-y-1">
											<p className="text-sm font-medium leading-none">{session.user.name}</p>
											<p className="text-xs leading-none text-muted-foreground">{session.user.email}</p>
										</div>
									</DropdownMenuLabel>
									<DropdownMenuSeparator />
									<DropdownMenuItem asChild>
										<Link href="/account">
											<User className="mr-2 h-4 w-4" />
											Account
										</Link>
									</DropdownMenuItem>
									<DropdownMenuItem asChild>
										<Link href="/account/billing">
											<CreditCard className="mr-2 h-4 w-4" />
											Billing
										</Link>
									</DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuItem
										className="cursor-pointer"
										onSelect={(event) => {
											event.preventDefault()
											signOut({
												callbackUrl: `${window.location.origin}/login`,
											})
										}}
									>
										<LogOut className="mr-2 h-4 w-4" />
										Log out
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						) : (
							<Link href="/login">
								<Button variant="secondary" size="sm">
									Login
								</Button>
							</Link>
						)}
					</nav>
				</div>
			</div>
		</header>
	)
}


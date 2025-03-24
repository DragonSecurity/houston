"use client"

import type React from "react"

import { useState } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
	Gauge,
	User,
	HelpCircle,
	LogOut,
	Menu,
	Moon,
	Sun,
	Globe,
	Lock,
	Fingerprint,
	CreditCard,
	Bell,
	Key,
	Users, RocketIcon,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AccountLayoutProps {
	children: React.ReactNode
}

export function AccountLayout({ children }: AccountLayoutProps) {
	const { data: session, status } = useSession()
	const pathname = usePathname()
	const { theme, setTheme } = useTheme()
	const [open, setOpen] = useState(false)

	// Main navigation
	const navigation = [
		{ name: "Dashboard", href: "/dashboard", icon: Gauge },
		{ name: "Account", href: "/account", icon: User },
		{ name: "Help", href: "/help", icon: HelpCircle },
	]

	// Account sub-navigation
	const accountNavigation = [
		{ name: "Profile", href: "/account/profile", icon: User, permission: "user" },
		{ name: "Password", href: "/account/password", icon: Lock, permission: "user" },
		{ name: "2FA", href: "/account/2fa", icon: Fingerprint, permission: "user" },
		{ name: "Billing", href: "/account/billing", icon: CreditCard, permission: "owner" },
		{ name: "Notifications", href: "/account/notifications", icon: Bell, permission: "user" },
		{ name: "API Keys", href: "/account/apikeys", icon: Key, permission: "developer" },
		{ name: "Users", href: "/account/users", icon: Users, permission: "admin" },
	]

	// Mock permission check - in a real app, this would come from the user's session
	const isOwner = true
	const isAdmin = true
	const isDeveloper = true

	// Filter navigation based on user permissions
	const filteredAccountNav = accountNavigation.filter((item) => {
		if (item.permission === "owner" && !isOwner) return false
		if (item.permission === "admin" && !isAdmin) return false
		if (item.permission === "developer" && !isDeveloper) return false
		return true
	})

	return (
		<div className="flex h-screen bg-background">
			{/* Mobile menu */}
			<Sheet open={open} onOpenChange={setOpen}>
				<SheetTrigger asChild>
					<Button variant="ghost" size="icon" className="md:hidden fixed top-4 left-4 z-40">
						<Menu className="h-5 w-5" />
						<span className="sr-only">Open menu</span>
					</Button>
				</SheetTrigger>
				<SheetContent side="left" className="w-64 p-0">
					<div className="flex flex-col h-full">
						<div className="p-4">
							<RocketIcon />
						</div>
						<nav className="flex-1 px-2 py-4 space-y-1">
							{navigation.map((item) => (
								<Link
									key={item.name}
									href={item.href}
									className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
										pathname === item.href
											? "bg-primary/10 text-primary"
											: "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
									}`}
									onClick={() => setOpen(false)}
								>
									<item.icon className="mr-3 h-5 w-5" />
									{item.name}
								</Link>
							))}

							{/* Account sub-navigation for mobile */}
							{pathname.startsWith("/account") && (
								<>
									<div className="pt-4 pb-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
										Account
									</div>
									{filteredAccountNav.map((item) => (
										<Link
											key={item.name}
											href={item.href}
											className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
												pathname === item.href
													? "bg-primary/10 text-primary"
													: "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
											}`}
											onClick={() => setOpen(false)}
										>
											<item.icon className="mr-3 h-5 w-5" />
											{item.name}
										</Link>
									))}
								</>
							)}
						</nav>
						<div className="p-4 border-t">
							<Button
								variant="ghost"
								className="w-full justify-start"
								onClick={() => {
									setOpen(false)
									// Sign out logic
								}}
							>
								<LogOut className="mr-3 h-5 w-5" />
								Sign Out
							</Button>
						</div>
					</div>
				</SheetContent>
			</Sheet>

			{/* Desktop sidebar */}
			<div className="hidden md:flex md:flex-col md:w-16 md:fixed md:inset-y-0 border-r">
				<div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
					<div className="flex-1 flex flex-col pt-5 pb-4">
						<div className="flex items-center justify-center h-16">
							<RocketIcon />
						</div>
						<nav className="mt-5 flex-1 px-2 space-y-1 flex flex-col items-center">
							{navigation.map((item) => (
								<Link
									key={item.name}
									href={item.href}
									className={`p-3 rounded-md hover:bg-accent ${
										pathname === item.href ? "bg-primary/10 text-primary" : "text-muted-foreground"
									}`}
									title={item.name}
								>
									<item.icon className="h-6 w-6" />
									<span className="sr-only">{item.name}</span>
								</Link>
							))}
						</nav>
					</div>
					<div className="flex-shrink-0 flex flex-col p-2 items-center mb-4 space-y-2">
						<Button
							variant="ghost"
							size="icon"
							onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
							title={theme === "dark" ? "Light mode" : "Dark mode"}
						>
							{theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
							<span className="sr-only">Toggle theme</span>
						</Button>
						<Button
							variant="ghost"
							size="icon"
							title="Sign out"
							onClick={() => {
								// Sign out logic
							}}
						>
							<LogOut className="h-5 w-5" />
							<span className="sr-only">Sign out</span>
						</Button>
					</div>
				</div>
			</div>

			{/* Main content */}
			<div className="flex flex-col flex-1 md:pl-16">
				<header className="sticky top-0 z-10 flex items-center justify-between h-16 px-4 border-b bg-background">
					<h1 className="text-xl font-semibold md:text-2xl">Account</h1>
					<div className="flex items-center">
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" className="relative h-8 w-8 rounded-full">
									<Avatar className="h-8 w-8">
										<AvatarImage src={session?.user?.image || undefined} alt={session?.user?.name || "User"} />
										<AvatarFallback>{session?.user?.name?.charAt(0) || "U"}</AvatarFallback>
									</Avatar>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuLabel>My Account</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuItem asChild>
									<Link href="/account/profile">Profile</Link>
								</DropdownMenuItem>
								<DropdownMenuItem onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
									{theme === "dark" ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
									{theme === "dark" ? "Light mode" : "Dark mode"}
								</DropdownMenuItem>
								<DropdownMenuItem>
									<Globe className="mr-2 h-4 w-4" />
									Language
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem>
									<LogOut className="mr-2 h-4 w-4" />
									Sign out
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</header>

				<div className="flex flex-1 overflow-hidden">
					{/* Account sub-navigation for desktop */}
					<div className="hidden md:block w-64 border-r overflow-y-auto">
						<nav className="p-4 space-y-1">
							{filteredAccountNav.map((item) => (
								<Link
									key={item.name}
									href={item.href}
									className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
										pathname === item.href
											? "bg-primary/10 text-primary"
											: "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
									}`}
								>
									<item.icon className="mr-3 h-5 w-5" />
									{item.name}
								</Link>
							))}
						</nav>
					</div>

					{/* Mobile sub-navigation dropdown */}
					<div className="md:hidden p-4 w-full">
						<Select
							value={pathname}
							onValueChange={(value) => {
								window.location.href = value
							}}
						>
							<SelectTrigger>
								<SelectValue placeholder="Select section" />
							</SelectTrigger>
							<SelectContent>
								{filteredAccountNav.map((item) => (
									<SelectItem key={item.href} value={item.href}>
										<div className="flex items-center">
											<item.icon className="mr-2 h-4 w-4" />
											{item.name}
										</div>
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{/* Main content area */}
					<main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
				</div>
			</div>
		</div>
	)
}


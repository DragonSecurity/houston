'use client'

import Link from "next/link";
import {Menu, RocketIcon} from "lucide-react";
import {MobileNav} from "@/components/mobile-nav";
import {Button} from "@/components/ui/button";
import {ThemeToggle} from "@/components/theme-toggle";
import {Session} from "next-auth";
import {usePathname} from "next/navigation";
import {Sheet, SheetContent, SheetTrigger} from "@/components/ui/sheet";
import {signOut} from "next-auth/react";
import {cn} from "@/lib/utils";

export function Header({session}: {session: Session | null}) {
	const pathname = usePathname();

	const navigation = [
		{ name: "Features", href: "/#features" },
		{ name: "Pricing", href: "/#pricing" },
		{ name: "FAQs", href: "/#faqs" },
		{ name: "Contact", href: "/#contact" },
	];

	return (
		<header className="sticky top-0 z-50 w-full border-b bg-primary">
			<div className="container flex h-16 items-center px-4 sm:px-6">
				<Sheet>
					<SheetTrigger asChild>
						<Button variant="ghost" size="icon" className="md:hidden">
							<Menu className="h-6 w-6" />
							<span className="sr-only">Toggle menu</span>
						</Button>
					</SheetTrigger>
					<SheetContent side="left" className="w-[300px] sm:w-[400px]">
						<nav className="flex flex-col gap-4 mt-8">
							{navigation.map((item) => (
								<Link
									key={item.name}
									href={item.href}
									className="text-lg font-medium transition-colors hover:text-purple-600"
								>
									{item.name}
								</Link>
							))}
							<div className="flex flex-col gap-2 mt-4">
								{session?.user ? (
									<>
										<div className="text-sm text-gray-500 mb-2">
											Signed in as {session.user.email}
										</div>
										<Button asChild className="w-full" variant="outline">
											<Link href="/profile">My Profile</Link>
										</Button>
										<Button
											className="w-full"
											variant="destructive"
											onClick={() => signOut()}
										>
											Sign out
										</Button>
									</>
								) : (
									<>
										<Button asChild className="w-full" variant="outline">
											<Link href="/signin">Log in</Link>
										</Button>
										<Button asChild className="w-full">
											<Link href="/signup">Sign up</Link>
										</Button>
									</>
								)}
							</div>
						</nav>
					</SheetContent>
				</Sheet>
				<Link href="/" className="flex items-center mr-6">
					<div className="relative h-10 w-24">
						<RocketIcon />
					</div>
					<span className="ml-2 text-xl font-bold text-foreground">Houston</span>
				</Link>
				<div className="hidden md:flex items-center gap-4 ml-auto">
					<nav className="flex items-center space-x-6 text-sm font-medium">
						{navigation.map((item) => (
							<Link
								key={item.name}
								href={item.href}
								className="flex items-center text-lg font-medium text-foreground/60 transition-colors hover:text-foreground/80 sm:text-sm"
							>
								{item.name}
							</Link>
						))}
					</nav>

					<div className="flex items-center gap-2">
						<ThemeToggle />
						{session?.user ? (
							<>
							<Button asChild variant='outline' size="sm">
								<Link href='/dashboard'>Dashboard</Link>
							</Button>
								<Button size='sm' onClick={() => signOut()}>Sign Out</Button>
							</>
							) : (
							<>
								<Button asChild variant="outline" size="sm">
									<Link href="/signin">Log in</Link>
								</Button>
								<Button
									asChild
									size="sm"
								>
									<Link href="/signup">Sign Up!</Link>
								</Button>
							</>
						)}
					</div>
				</div>
			</div>
		</header>
	)
}
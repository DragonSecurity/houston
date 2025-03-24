import type React from "react"
import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"

import { authOptions } from "@/lib/auth"
import { SiteHeader } from "@/components/site-header"
import { AccountSidebar } from "./account-sidebar"
import { AccountMobileNav } from "./account-mobile-nav"

export const metadata: Metadata = {
	title: "Account",
	description: "Manage your account settings and preferences.",
}

export default async function AccountLayout({
	                                            children,
                                            }: {
	children: React.ReactNode
}) {
	const session = await getServerSession(authOptions)

	if (!session?.user) {
		redirect("/login")
	}

	return (
		<div className="flex min-h-screen flex-col">
			<SiteHeader />
			<div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
				<aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block">
					<div className="h-full py-6 pr-6 lg:py-8">
						<AccountSidebar />
					</div>
				</aside>
				<main className="flex w-full flex-col overflow-hidden pt-6 lg:pt-8">
					<div className="flex items-center justify-between md:hidden mb-4">
						<AccountMobileNav />
						<h1 className="text-xl font-semibold">Account</h1>
						<div className="w-9"></div> {/* Spacer for alignment */}
					</div>
					{children}
				</main>
			</div>
		</div>
	)
}


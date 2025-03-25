import {ReactNode} from "react";
import {AuthProvider} from "@/components/auth-provider";
import {Header} from "@/components/header";
import {getServerSession} from "next-auth/next";
import {authOptions} from "@/lib/auth";

export default async function AuthLayout({children}: {children: ReactNode}) {
	const session = await getServerSession(authOptions)

	return (
		<AuthProvider>
			<div className="flex min-h-screen flex-col">
				<Header session={session} />
				<div className="flex-1">{children}</div>

			</div>
		</AuthProvider>
	)
}
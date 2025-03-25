import type { Metadata } from "next"
import { SecurityForm } from "./security-form"
import { TwoFactorForm } from "./two-factor-form"
import { SessionsTable } from "./sessions-table"

export const metadata: Metadata = {
	title: "Security",
	description: "Manage your account security settings.",
}

export default function SecurityPage() {
	return (
		<div className="space-y-6">
			<div>
				<h3 className="text-lg font-medium">Security</h3>
				<p className="text-sm text-muted-foreground">Manage your account security and active sessions.</p>
			</div>

			<SecurityForm />
			<TwoFactorForm />
			<SessionsTable />
		</div>
	)
}


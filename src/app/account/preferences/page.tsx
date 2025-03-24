import type { Metadata } from "next"
import { PreferencesForm } from "./preferences-form"

export const metadata: Metadata = {
	title: "Preferences",
	description: "Manage your application preferences.",
}

export default function PreferencesPage() {
	return (
		<div className="space-y-6">
			<div>
				<h3 className="text-lg font-medium">Preferences</h3>
				<p className="text-sm text-muted-foreground">Customize your application experience.</p>
			</div>

			<PreferencesForm />
		</div>
	)
}


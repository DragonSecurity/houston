import type { Metadata } from "next"
import { NotificationsForm } from "./notifications-form"

export const metadata: Metadata = {
	title: "Notifications",
	description: "Manage your notification preferences.",
}

export default function NotificationsPage() {
	return (
		<div className="space-y-6">
			<div>
				<h3 className="text-lg font-medium">Notification Preferences</h3>
				<p className="text-sm text-muted-foreground">Configure how and when you receive notifications.</p>
			</div>
			<NotificationsForm />
		</div>
	)
}


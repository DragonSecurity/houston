import type { Metadata } from "next"
import { ApiKeysTable } from "./api-keys-table"
import { ApiKeyForm } from "./api-key-form"

export const metadata: Metadata = {
	title: "API Keys",
	description: "Manage your API keys for programmatic access.",
}

export default function ApiKeysPage() {
	return (
		<div className="space-y-6">
			<div>
				<h3 className="text-lg font-medium">API Keys</h3>
				<p className="text-sm text-muted-foreground">Manage your API keys for programmatic access to our services.</p>
			</div>

			<ApiKeyForm />
			<ApiKeysTable />
		</div>
	)
}


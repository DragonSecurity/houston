"use client"

import { useState } from "react"
import { ApiKeysTable } from "./api-keys-table"
import { ApiKeyForm } from "./api-key-form"

export default function ApiKeysPage() {
	const [refreshTrigger, setRefreshTrigger] = useState(0)

	const handleApiKeyCreated = () => {
		setRefreshTrigger((prev) => prev + 1)
	}

	return (
		<div className="space-y-6">
			<div>
				<h3 className="text-lg font-medium">API Keys</h3>
				<p className="text-sm text-muted-foreground">Manage your API keys for programmatic access to our services.</p>
			</div>

			<ApiKeyForm onApiKeyCreated={handleApiKeyCreated} />
			<ApiKeysTable refreshTrigger={refreshTrigger} />
		</div>
	)
}


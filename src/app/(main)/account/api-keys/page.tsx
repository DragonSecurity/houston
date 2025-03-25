import type {Metadata} from "next"
import ApiKeysPage from "./ApiKeysPage"

export const metadata: Metadata = {
	title: "API Keys",
	description: "Manage your API keys for programmatic access.",
}

export default function Page() {
	return <ApiKeysPage />
}


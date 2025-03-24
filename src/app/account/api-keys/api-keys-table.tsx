"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {toast} from "sonner";

// Mock data for API keys
const mockApiKeys = [
	{
		id: "1",
		name: "Development API Key",
		scope: "read",
		lastUsed: "2 hours ago",
		created: "2023-04-01",
	},
	{
		id: "2",
		name: "Production API Key",
		scope: "write",
		lastUsed: "Just now",
		created: "2023-03-15",
	},
	{
		id: "3",
		name: "Testing API Key",
		scope: "admin",
		lastUsed: "Never",
		created: "2023-05-10",
	},
]

export function ApiKeysTable() {
	const [apiKeys, setApiKeys] = useState(mockApiKeys)
	const [isLoading, setIsLoading] = useState(false)
	const [keyToDelete, setKeyToDelete] = useState<string | null>(null)

	async function handleRevoke(keyId: string) {
		setIsLoading(true)

		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 1000))

		setApiKeys(apiKeys.filter((key) => key.id !== keyId))
		toast.success("API key revoked",{
			description: "The API key has been successfully revoked.",
		})

		setKeyToDelete(null)
		setIsLoading(false)
	}

	function getScopeBadge(scope: string) {
		switch (scope) {
			case "read":
				return (
					<Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
						Read
					</Badge>
				)
			case "write":
				return (
					<Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
						Write
					</Badge>
				)
			case "admin":
				return (
					<Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
						Admin
					</Badge>
				)
			default:
				return <Badge variant="outline">Unknown</Badge>
		}
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>API Keys</CardTitle>
				<CardDescription>Manage your existing API keys.</CardDescription>
			</CardHeader>
			<CardContent>
				{apiKeys.length === 0 ? (
					<div className="text-center py-6 text-muted-foreground">No API keys found. Create one to get started.</div>
				) : (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Name</TableHead>
								<TableHead>Scope</TableHead>
								<TableHead>Created</TableHead>
								<TableHead>Last Used</TableHead>
								<TableHead className="text-right">Action</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{apiKeys.map((key) => (
								<TableRow key={key.id}>
									<TableCell className="font-medium">{key.name}</TableCell>
									<TableCell>{getScopeBadge(key.scope)}</TableCell>
									<TableCell>{key.created}</TableCell>
									<TableCell>{key.lastUsed}</TableCell>
									<TableCell className="text-right">
										<AlertDialog open={keyToDelete === key.id} onOpenChange={(open) => !open && setKeyToDelete(null)}>
											<AlertDialogTrigger asChild>
												<Button
													variant="ghost"
													size="sm"
													className="text-red-500 hover:text-red-700 hover:bg-red-50"
													onClick={() => setKeyToDelete(key.id)}
												>
													Revoke
												</Button>
											</AlertDialogTrigger>
											<AlertDialogContent>
												<AlertDialogHeader>
													<AlertDialogTitle>Revoke API Key</AlertDialogTitle>
													<AlertDialogDescription>
														Are you sure you want to revoke this API key? This action cannot be undone and any
														applications using this key will no longer be able to access the API.
													</AlertDialogDescription>
												</AlertDialogHeader>
												<AlertDialogFooter>
													<AlertDialogCancel>Cancel</AlertDialogCancel>
													<AlertDialogAction
														className="bg-red-500 hover:bg-red-600"
														onClick={() => handleRevoke(key.id)}
														disabled={isLoading}
													>
														{isLoading ? "Revoking..." : "Revoke Key"}
													</AlertDialogAction>
												</AlertDialogFooter>
											</AlertDialogContent>
										</AlertDialog>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				)}
			</CardContent>
		</Card>
	)
}


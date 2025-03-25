"use client"

import { useState, useEffect } from "react"
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
import { toast } from "sonner"
import { formatDate } from "@/lib/format"

interface ApiKey {
	id: string
	name: string
	scope: string
	lastUsed: string
	created: string
}

export function ApiKeysTable({ refreshTrigger }: { refreshTrigger?: number }) {
	const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [keyToDelete, setKeyToDelete] = useState<string | null>(null)
	const [isDeleting, setIsDeleting] = useState(false)

	useEffect(() => {
		fetchApiKeys()
	}, [refreshTrigger])

	async function fetchApiKeys() {
		try {
			setIsLoading(true)
			const response = await fetch("/api/user/api-keys")

			if (!response.ok) {
				throw new Error("Failed to fetch API keys")
			}

			const data = await response.json()
			setApiKeys(data.apiKeys || [])
		} catch (error) {
			console.error("Error fetching API keys:", error)
			toast.error("Error", {
				description: "Failed to load API keys. Please try again.",
			})
		} finally {
			setIsLoading(false)
		}
	}

	async function handleRevoke(keyId: string) {
		try {
			setIsDeleting(true)
			const response = await fetch(`/api/user/api-keys?id=${keyId}`, {
				method: "DELETE",
			})

			if (!response.ok) {
				throw new Error("Failed to revoke API key")
			}

			setApiKeys(apiKeys.filter((key) => key.id !== keyId))
			toast.success("API key revoked", {
				description: "The API key has been successfully revoked.",
			})
		} catch (error) {
			console.error("Error revoking API key:", error)
			toast.error("Error", {
				description: "Failed to revoke API key. Please try again.",
			})
		} finally {
			setKeyToDelete(null)
			setIsDeleting(false)
		}
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

	if (isLoading) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>API Keys</CardTitle>
					<CardDescription>Loading your API keys...</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="h-40 flex items-center justify-center">
						<p>Loading API keys...</p>
					</div>
				</CardContent>
			</Card>
		)
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
									<TableCell>{formatDate(new Date(key.created), "MMM d, yyyy")}</TableCell>
									<TableCell>
										{key.lastUsed === "Never" ? "Never" : formatDate(new Date(key.lastUsed), "relative")}
									</TableCell>
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
														disabled={isDeleting}
													>
														{isDeleting ? "Revoking..." : "Revoke Key"}
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


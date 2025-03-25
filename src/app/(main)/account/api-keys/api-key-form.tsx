"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import {toast} from "sonner";

const apiKeyFormSchema = z.object({
	name: z.string().min(1, "Name is required"),
	scope: z.string().min(1, "Scope is required"),
})

type ApiKeyFormValues = z.infer<typeof apiKeyFormSchema>

export function ApiKeyForm() {
	const [isLoading, setIsLoading] = useState(false)
	const [showKeyDialog, setShowKeyDialog] = useState(false)
	const [generatedKey, setGeneratedKey] = useState("")

	const form = useForm<ApiKeyFormValues>({
		resolver: zodResolver(apiKeyFormSchema),
		defaultValues: {
			name: "",
			scope: "read",
		},
	})

	async function onSubmit(data: ApiKeyFormValues) {
		setIsLoading(true)

		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 1000))

		// Generate a mock API key
		const mockApiKey = `sk_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`
		setGeneratedKey(mockApiKey)
		setShowKeyDialog(true)

		form.reset()
		setIsLoading(false)
	}

	function handleCopyKey() {
		navigator.clipboard.writeText(generatedKey)
		toast.success("API key copied",{
			description: "The API key has been copied to your clipboard.",
		})
	}

	function handleCloseDialog() {
		setShowKeyDialog(false)
		setGeneratedKey("")
	}

	return (
		<>
			<Card>
				<CardHeader>
					<CardTitle>Create API Key</CardTitle>
					<CardDescription>Create a new API key to access our services programmatically.</CardDescription>
				</CardHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<CardContent className="space-y-4">
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Name</FormLabel>
										<FormControl>
											<Input placeholder="My API Key" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="scope"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Scope</FormLabel>
										<Select onValueChange={field.onChange} defaultValue={field.value}>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select a scope" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value="read">Read (Safe, limited access)</SelectItem>
												<SelectItem value="write">Write (Can modify data)</SelectItem>
												<SelectItem value="admin">Admin (Full access)</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
						</CardContent>
						<CardFooter>
							<Button type="submit" disabled={isLoading}>
								{isLoading ? "Creating..." : "Create API key"}
							</Button>
						</CardFooter>
					</form>
				</Form>
			</Card>

			<Dialog open={showKeyDialog} onOpenChange={handleCloseDialog}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>API Key Created</DialogTitle>
						<DialogDescription>
							Your API key has been created. Please copy it now as you won&#39;t be able to see it again.
						</DialogDescription>
					</DialogHeader>

					<div className="flex items-center space-x-2">
						<Input value={generatedKey} readOnly className="font-mono" />
						<Button variant="outline" size="sm" onClick={handleCopyKey}>
							Copy
						</Button>
					</div>

					<DialogFooter>
						<Button onClick={handleCloseDialog}>Done</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	)
}


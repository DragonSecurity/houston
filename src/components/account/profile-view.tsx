"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {toast} from "sonner";

const formSchema = z.object({
	name: z.string().min(1, "Name is required"),
	email: z.string().email("Please enter a valid email address"),
	avatar: z.any().optional(),
	account_name: z.string().optional(),
	account_type: z.string().optional(), // Added account type field
})

export function ProfileView() {
	const { data: session, update } = useSession()
	const router = useRouter()
	const [isLoading, setIsLoading] = useState(false)
	const [userData, setUserData] = useState<any>(null)

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			email: "",
			account_name: "",
			account_type: "personal", // Default value
		},
	})

	useEffect(() => {
		async function fetchUserData() {
			try {
				const response = await fetch("/api/user")
				const data = await response.json()

				if (data.data) {
					setUserData(data.data)
					form.reset({
						name: data.data.name || "",
						email: data.data.email || "",
						account_name: data.data.accounts?.[0]?.name || "",
						account_type: data.data.accounts?.[0]?.type || "personal",
					})
				}
			} catch (error) {
				console.error("Failed to fetch user data:", error)
				toast.error("Failed to load profile",{
					description: "Please try again later.",
				})
			}
		}

		fetchUserData()
	}, [form, toast])

	async function onSubmit(values: z.infer<typeof formSchema>) {
		setIsLoading(true)

		try {
			const formData = new FormData()
			formData.append("name", values.name)
			formData.append("email", values.email)

			if (values.account_name) {
				formData.append("account_name", values.account_name)
			}

			if (values.account_type) {
				formData.append("account_type", values.account_type)
			}

			if (values.avatar && values.avatar[0]) {
				formData.append("avatar", values.avatar[0])
			}

			const response = await fetch("/api/user", {
				method: "PATCH",
				body: formData,
			})

			const data = await response.json()

			if (!response.ok) {
				throw new Error(data.error || "Failed to update profile")
			}

			// Update session
			await update({
				...session,
				user: {
					...session?.user,
					name: values.name,
					email: values.email,
					image: data.data.image || session?.user?.image,
				},
			})

			toast.success("Profile Updated",{
				description: "Your profile has been updated successfully.",
			})
		} catch (error) {
			console.error("Profile update error:", error)
			toast.error("Something went wrong",{
				description: error instanceof Error ? error.message : "Failed to update profile",
			})
		}

		setIsLoading(false)
	}

	async function closeAccount() {
		try {
			const response = await fetch("/api/user", {
				method: "DELETE",
			})

			if (!response.ok) {
				throw new Error("Failed to close account")
			}

			toast.success("Account Closed",{
				description: "Your account has been closed successfully.",
			})

			router.push("/")
		} catch (error) {
			console.error("Close account error:", error)
			toast.error("Something went wrong",{
				description: "Failed to close your account. Please try again later.",
			})
		}
	}

	return (
		<div className="container mx-auto p-6 max-w-2xl">
			<Card>
				<CardHeader>
					<CardTitle>Edit Your Profile</CardTitle>
					<CardDescription>Update your profile information</CardDescription>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Your Name</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email address</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormDescription>Changing your email will require verification.</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="avatar"
								render={({ field: { value, onChange, ...field } }) => (
									<FormItem>
										<FormLabel>Profile Picture</FormLabel>
										<FormControl>
											<Input type="file" accept="image/*" onChange={(e) => onChange(e.target.files)} {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{userData?.accounts?.length > 0 && (
								<>
									<FormField
										control={form.control}
										name="account_name"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Account Name</FormLabel>
												<FormControl>
													<Input {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="account_type"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Account Type</FormLabel>
												<Select onValueChange={field.onChange} defaultValue={field.value}>
													<FormControl>
														<SelectTrigger>
															<SelectValue placeholder="Select account type" />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														<SelectItem value="personal">Personal</SelectItem>
														<SelectItem value="business">Business</SelectItem>
														<SelectItem value="education">Education</SelectItem>
													</SelectContent>
												</Select>
												<FormMessage />
											</FormItem>
										)}
									/>
								</>
							)}

							<Button type="submit" disabled={isLoading}>
								{isLoading ? "Saving..." : "Save"}
							</Button>
						</form>
					</Form>
				</CardContent>
			</Card>

			<Card className="mt-6">
				<CardHeader>
					<CardTitle>Danger Zone</CardTitle>
					<CardDescription>Irreversible actions</CardDescription>
				</CardHeader>
				<CardContent>
					<AlertDialog>
						<AlertDialogTrigger asChild>
							<Button variant="destructive">Delete Your Account</Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
								<AlertDialogDescription>
									This action cannot be undone. This will permanently delete your account and remove your data from our
									servers.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Cancel</AlertDialogCancel>
								<AlertDialogAction onClick={closeAccount}>Delete</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</CardContent>
			</Card>
		</div>
	)
}


"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {toast} from "sonner";

const profileFormSchema = z.object({
	name: z
		.string()
		.min(2, {
			message: "Name must be at least 2 characters.",
		})
		.max(30, {
			message: "Name must not be longer than 30 characters.",
		}),
	email: z.string().email({
		message: "Please enter a valid email address.",
	}),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

interface ProfileFormProps {
	user: {
		id: string
		name: string | null
		email: string
		image: string | null
	}
}

export function ProfileForm({ user }: ProfileFormProps) {
	const router = useRouter()
	const [isLoading, setIsLoading] = useState(false)

	const form = useForm<ProfileFormValues>({
		resolver: zodResolver(profileFormSchema),
		defaultValues: {
			name: user.name || "",
			email: user.email,
		},
	})

	async function onSubmit(data: ProfileFormValues) {
		setIsLoading(true)

		try {
			const response = await fetch("/api/user/profile", {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			})

			if (!response.ok) {
				throw new Error("Failed to update profile")
			}

			toast.success("Profile updated",{
				description: "Your profile has been updated successfully.",
			})

			router.refresh()
		} catch (error) {
			console.error("Error updating profile:", error)
			toast.error("Error",{
				description: "Failed to update profile. Please try again.",
			})
		} finally {
			setIsLoading(false)
		}
	}

	function getInitials(name: string) {
		return name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase()
	}

	return (
		<div className="space-y-8">
			<div className="flex items-center gap-4">
				<Avatar className="h-20 w-20">
					<AvatarImage src={user.image || ""} alt={user.name || "User"} />
					<AvatarFallback className="text-lg">{user.name ? getInitials(user.name) : "U"}</AvatarFallback>
				</Avatar>
				<div>
					<h4 className="text-lg font-medium">{user.name || "User"}</h4>
					<p className="text-sm text-muted-foreground">{user.email}</p>
				</div>
			</div>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Name</FormLabel>
								<FormControl>
									<Input placeholder="Your name" {...field} />
								</FormControl>
								<FormDescription>This is your public display name.</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input placeholder="Your email" {...field} disabled />
								</FormControl>
								<FormDescription>Your email address is used for login and notifications.</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button type="submit" disabled={isLoading}>
						{isLoading ? "Updating..." : "Update profile"}
					</Button>
				</form>
			</Form>
		</div>
	)
}


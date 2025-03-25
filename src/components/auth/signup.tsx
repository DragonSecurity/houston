"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { SocialSignin } from "./social-signin"
import { signIn } from "next-auth/react"
import {toast} from "sonner";

const formSchema = z.object({
	name: z.string().min(1, "Name is required"),
	email: z.string().email("Please enter a valid email address"),
	password: z
		.string()
		.min(8, "Password must be at least 8 characters")
		.regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character"),
})

export function SignUp() {
	const router = useRouter()
	const [isLoading, setIsLoading] = useState(false)

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			email: "",
			password: "",
		},
	})

	async function onSubmit(values: z.infer<typeof formSchema>) {
		setIsLoading(true)

		try {
			const response = await fetch("/api/account", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(values),
			})

			const data = await response.json()

			if (!response.ok) {
				throw new Error(data.error || "Failed to create account")
			}

			// Sign in the user
			const result = await signIn("credentials", {
				email: values.email,
				password: values.password,
				redirect: false,
			})

			if (result?.error) {
				toast.error("Sign in failed",{
					description: "Account created but couldn't sign in automatically.",
				})
				router.push("/")
			} else {
				router.push("/signup/verify")
			}
		} catch (error) {
			console.error("Signup error:", error)
			toast.error("Something went wrong",{
				description: error instanceof Error ? error.message : "Failed to create account",
			})
		}

		setIsLoading(false)
	}

	return (
		<div className="flex flex-col items-center justify-center w-full max-w-md mx-auto space-y-6 p-6">
			<h1 className="text-3xl font-semibold text-center text-primary">Create Your Account</h1>

			<SocialSignin signup />

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Name</FormLabel>
								<FormControl>
									<Input placeholder="Your name" {...field} />
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
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input placeholder="name@example.com" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Password</FormLabel>
								<FormControl>
									<Input type="password" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button type="submit" className="w-full" disabled={isLoading}>
						{isLoading ? "Creating Account..." : "Create Account"}
					</Button>
				</form>
			</Form>

			<div className="text-center text-sm">
				Already registered?{" "}
				<Link href="/signin" className="text-primary hover:underline">
					Sign In
				</Link>
			</div>
		</div>
	)
}


"use client"

import { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import Link from "next/link"
import {toast} from "sonner";

const formSchema = z.object({
	email: z.string().email("Please enter a valid email address"),
})

export default function ForgotPasswordPage() {
	const [isLoading, setIsLoading] = useState(false)
	const [isSubmitted, setIsSubmitted] = useState(false)

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
		},
	})

	async function onSubmit(values: z.infer<typeof formSchema>) {
		setIsLoading(true)

		try {
			const response = await fetch("/api/user/password/reset/request", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(values),
			})

			if (!response.ok) {
				const data = await response.json()
				throw new Error(data.error || "Failed to send reset email")
			}

			setIsSubmitted(true)
		} catch (error) {
			console.error("Password reset request error:", error)
			toast.error(error instanceof Error ? error.message : "Failed to send password reset email")
		}

		setIsLoading(false)
	}

	if (isSubmitted) {
		return (
			<div className="flex flex-col items-center justify-center w-full max-w-md mx-auto space-y-6 p-6">
				<h1 className="text-3xl font-semibold text-center text-primary">Check Your Email</h1>
				<p className="text-center">
					If an account exists with the email you provided, we&#39;ve sent instructions to reset your password. Please check
					your email inbox.
				</p>
				<p className="text-center text-sm">
					Didn&#39;t receive an email?{" "}
					<button onClick={() => setIsSubmitted(false)} className="text-primary hover:underline">
						Try again
					</button>
				</p>
				<div className="text-center text-sm">
					<Link href="/public" className="text-primary hover:underline">
						Return to Sign In
					</Link>
				</div>
			</div>
		)
	}

	return (
		<div className="flex flex-col items-center justify-center w-full max-w-md mx-auto space-y-6 p-6">
			<h1 className="text-3xl font-semibold text-center text-primary">Forgot Your Password?</h1>
			<p className="text-center">Enter your email address and we&#39;ll send you instructions to reset your password.</p>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
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

					<Button type="submit" className="w-full" disabled={isLoading}>
						{isLoading ? "Sending..." : "Send Reset Instructions"}
					</Button>
				</form>
			</Form>

			<div className="text-center text-sm">
				Remember your password?{" "}
				<Link href="/signin" className="text-primary hover:underline">
					Sign In
				</Link>
			</div>
		</div>
	)
}


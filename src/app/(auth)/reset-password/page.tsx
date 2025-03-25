"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import Link from "next/link"
import {toast} from "sonner";

const formSchema = z
	.object({
		password: z
			.string()
			.min(8, "Password must be at least 8 characters")
			.regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character"),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	})

export default function ResetPasswordPage() {
	const router = useRouter()
	const searchParams = useSearchParams()
	const [token, setToken] = useState<string | null>(null)
	const [isLoading, setIsLoading] = useState(false)

	useEffect(() => {
		const tokenParam = searchParams.get("token")
		if (tokenParam) {
			setToken(tokenParam)
		}
	}, [searchParams])

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			password: "",
			confirmPassword: "",
		},
	})

	async function onSubmit(values: z.infer<typeof formSchema>) {
		if (!token) {
			toast.error("Invalid or missing reset token")
			return
		}

		setIsLoading(true)

		try {
			const response = await fetch("/api/user/password/reset", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					token,
					password: values.password,
				}),
			})

			const data = await response.json()

			if (!response.ok) {
				throw new Error(data.error || "Failed to reset password")
			}

			toast.success("Password reset successfully")
			router.push("/")
		} catch (error) {
			console.error("Password reset error:", error)
			toast.error(error instanceof Error ? error.message : "Failed to reset password. The link may have expired.")
		}

		setIsLoading(false)
	}

	if (!token) {
		return (
			<div className="flex flex-col items-center justify-center w-full max-w-md mx-auto space-y-6 p-6">
				<h1 className="text-3xl font-semibold text-center text-primary">Invalid Reset Link</h1>
				<p className="text-center">
					The password reset link is invalid or has expired. Please request a new password reset link.
				</p>
				<Button asChild>
					<Link href="/forgot-password">Request New Link</Link>
				</Button>
			</div>
		)
	}

	return (
		<div className="flex flex-col items-center justify-center w-full max-w-md mx-auto space-y-6 p-6">
			<h1 className="text-3xl font-semibold text-center text-primary">Reset Your Password</h1>
			<p className="text-center">Please enter your new password below.</p>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
					<FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<FormItem>
								<FormLabel>New Password</FormLabel>
								<FormControl>
									<Input type="password" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="confirmPassword"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Confirm Password</FormLabel>
								<FormControl>
									<Input type="password" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button type="submit" className="w-full" disabled={isLoading}>
						{isLoading ? "Resetting Password..." : "Reset Password"}
					</Button>
				</form>
			</Form>

			<div className="text-center text-sm">
				Remember your password?{" "}
				<Link href="/public" className="text-primary hover:underline">
					Sign In
				</Link>
			</div>
		</div>
	)
}


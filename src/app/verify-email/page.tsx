"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"
import Link from "next/link"

export default function VerifyEmailPage() {
	const router = useRouter()
	const searchParams = useSearchParams()
	const token = searchParams.get("token")

	const [verificationState, setVerificationState] = useState<"loading" | "success" | "error">("loading")
	const [errorMessage, setErrorMessage] = useState<string>("")

	useEffect(() => {
		if (!token) {
			setVerificationState("error")
			setErrorMessage("Verification token is missing")
			return
		}

		const verifyEmail = async () => {
			try {
				const response = await fetch("/api/user/verify", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ token }),
				})

				const data = await response.json()

				if (!response.ok) {
					throw new Error(data.error || "Failed to verify email")
				}

				setVerificationState("success")
			} catch (error) {
				console.error("Verification error:", error)
				setVerificationState("error")
				setErrorMessage(error instanceof Error ? error.message : "An unexpected error occurred")
			}
		}

		verifyEmail()
	}, [token])

	return (
		<div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
			<Card className="w-full max-w-md">
				<CardHeader className="text-center">
					<CardTitle className="text-2xl font-bold">Email Verification</CardTitle>
					<CardDescription>
						{verificationState === "loading" && "Verifying your email address..."}
						{verificationState === "success" && "Your email has been verified!"}
						{verificationState === "error" && "Verification failed"}
					</CardDescription>
				</CardHeader>
				<CardContent className="flex flex-col items-center justify-center p-6">
					{verificationState === "loading" && (
						<div className="flex flex-col items-center space-y-4">
							<Loader2 className="h-16 w-16 animate-spin text-primary" />
							<p className="text-center text-sm text-gray-500">Please wait while we verify your email address...</p>
						</div>
					)}

					{verificationState === "success" && (
						<div className="flex flex-col items-center space-y-4">
							<CheckCircle className="h-16 w-16 text-green-500" />
							<div className="text-center">
								<p className="text-lg font-medium">Thank you for verifying your email!</p>
								<p className="mt-2 text-sm text-gray-500">
									Your email has been successfully verified. You can now access all features of your account.
								</p>
							</div>
						</div>
					)}

					{verificationState === "error" && (
						<div className="flex flex-col items-center space-y-4">
							<XCircle className="h-16 w-16 text-red-500" />
							<div className="text-center">
								<p className="text-lg font-medium">Verification Failed</p>
								<p className="mt-2 text-sm text-gray-500">
									{errorMessage || "We could not verify your email. The link may have expired or is invalid."}
								</p>
							</div>
						</div>
					)}
				</CardContent>
				<CardFooter className="flex justify-center space-x-4">
					{verificationState === "success" && (
						<Button onClick={() => router.push("/dashboard")}>Go to Dashboard</Button>
					)}

					{verificationState === "error" && (
						<>
							<Button variant="outline" asChild>
								<Link href="/signin">Back to Login</Link>
							</Button>
							<Button asChild>
								<Link href="/verify-email/request">Request New Link</Link>
							</Button>
						</>
					)}
				</CardFooter>
			</Card>
		</div>
	)
}


"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {toast} from "sonner";

export function TwoFactorForm() {
	const [isLoading, setIsLoading] = useState(false)
	const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
	const [showSetupDialog, setShowSetupDialog] = useState(false)
	const [verificationCode, setVerificationCode] = useState("")

	async function handleToggle(checked: boolean) {
		if (checked) {
			setShowSetupDialog(true)
		} else {
			setIsLoading(true)

			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1000))

			setTwoFactorEnabled(false)
			toast.success("Two-factor authentication disabled",{
				description: "Two-factor authentication has been disabled for your account.",
			})

			setIsLoading(false)
		}
	}

	async function setupTwoFactor() {
		setIsLoading(true)

		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 1000))

		setTwoFactorEnabled(true)
		setShowSetupDialog(false)
		toast.success("Two-factor authentication enabled",{
			description: "Two-factor authentication has been enabled for your account.",
		})

		setIsLoading(false)
	}

	return (
		<>
			<Card>
				<CardHeader>
					<CardTitle>Two-Factor Authentication</CardTitle>
					<CardDescription>
						Add an extra layer of security to your account by enabling two-factor authentication.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex items-center justify-between space-x-2">
						<Label htmlFor="two-factor" className="flex flex-col space-y-1">
							<span>Two-factor authentication</span>
							<span className="text-xs font-normal text-muted-foreground">
                Require a verification code when logging in.
              </span>
						</Label>
						<Switch id="two-factor" checked={twoFactorEnabled} onCheckedChange={handleToggle} disabled={isLoading} />
					</div>
				</CardContent>
				{twoFactorEnabled && (
					<CardFooter>
						<Button variant="outline" onClick={() => setShowSetupDialog(true)}>
							Configure authenticator app
						</Button>
					</CardFooter>
				)}
			</Card>

			<Dialog open={showSetupDialog} onOpenChange={setShowSetupDialog}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Set up two-factor authentication</DialogTitle>
						<DialogDescription>
							Scan the QR code with your authenticator app or enter the setup key manually.
						</DialogDescription>
					</DialogHeader>

					<div className="flex flex-col items-center space-y-4">
						<div className="border border-border p-4 rounded-lg">
							{/* Placeholder for QR code */}
							<div className="w-48 h-48 bg-muted flex items-center justify-center">
								<span className="text-xs text-muted-foreground">QR Code Placeholder</span>
							</div>
						</div>

						<div className="text-sm text-center">
							<p className="font-medium">Setup key</p>
							<p className="font-mono bg-muted p-2 rounded mt-1">ABCD EFGH IJKL MNOP</p>
						</div>

						<div className="w-full space-y-2">
							<Label htmlFor="verification-code">Verification code</Label>
							<Input
								id="verification-code"
								placeholder="Enter 6-digit code"
								value={verificationCode}
								onChange={(e) => setVerificationCode(e.target.value)}
								maxLength={6}
							/>
						</div>
					</div>

					<DialogFooter>
						<Button variant="outline" onClick={() => setShowSetupDialog(false)}>
							Cancel
						</Button>
						<Button onClick={setupTwoFactor} disabled={verificationCode.length !== 6 || isLoading}>
							{isLoading ? "Verifying..." : "Verify"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	)
}


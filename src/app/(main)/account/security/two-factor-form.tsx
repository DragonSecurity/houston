"use client"

import { useState, useEffect } from "react"
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
import { toast } from "sonner"
import { QRCodeSVG } from "qrcode.react"

export function TwoFactorForm() {
	const [isLoading, setIsLoading] = useState(false)
	const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
	const [showSetupDialog, setShowSetupDialog] = useState(false)
	const [verificationCode, setVerificationCode] = useState("")
	const [setupData, setSetupData] = useState<{ secret: string; otpauth: string } | null>(null)
	const [backupCodes, setBackupCodes] = useState<string[]>([])
	const [showBackupCodes, setShowBackupCodes] = useState(false)

	// Fetch 2FA status on component mount
	useEffect(() => {
		const fetch2FAStatus = async () => {
			try {
				const response = await fetch("/api/user/security/two-factor")
				if (response.ok) {
					const data = await response.json()
					setTwoFactorEnabled(data.enabled || false)
				}
			} catch (error) {
				console.error("Error fetching 2FA status:", error)
			}
		}

		fetch2FAStatus()
	}, [])

	async function handleToggle(checked: boolean) {
		if (checked) {
			await startSetup()
		} else {
			await disable2FA()
		}
	}

	async function startSetup() {
		setIsLoading(true)
		try {
			const response = await fetch("/api/user/security/two-factor", {
				method: "PUT",
			})

			if (!response.ok) {
				throw new Error("Failed to start 2FA setup")
			}

			const data = await response.json()
			setSetupData(data)
			setShowSetupDialog(true)
		} catch (error) {
			console.error("Error starting 2FA setup:", error)
			toast.error("Error", {
				description: "Failed to start 2FA setup. Please try again.",
			})
		} finally {
			setIsLoading(false)
		}
	}

	async function setupTwoFactor() {
		setIsLoading(true)

		try {
			const response = await fetch("/api/user/security/two-factor", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					code: verificationCode,
				}),
			})

			if (!response.ok) {
				const data = await response.json()
				throw new Error(data.error || "Failed to verify code")
			}

			const data = await response.json()
			setTwoFactorEnabled(true)
			setShowSetupDialog(false)
			setBackupCodes(data.backupCodes || [])
			setShowBackupCodes(true)

			toast.success("Two-factor authentication enabled", {
				description: "Two-factor authentication has been enabled for your account.",
			})
		} catch (error) {
			console.error("Error enabling 2FA:", error)
			toast.error("Error", {
				description: error instanceof Error ? error.message : "Failed to verify code. Please try again.",
			})
		} finally {
			setIsLoading(false)
		}
	}

	async function disable2FA() {
		setIsLoading(true)

		try {
			const response = await fetch("/api/user/security/two-factor", {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					confirm: true,
				}),
			})

			if (!response.ok) {
				throw new Error("Failed to disable 2FA")
			}

			setTwoFactorEnabled(false)
			toast.success("Two-factor authentication disabled", {
				description: "Two-factor authentication has been disabled for your account.",
			})
		} catch (error) {
			console.error("Error disabling 2FA:", error)
			toast.error("Error", {
				description: "Failed to disable 2FA. Please try again.",
			})
		} finally {
			setIsLoading(false)
		}
	}

	function copyBackupCodes() {
		navigator.clipboard.writeText(backupCodes.join("\n"))
		toast.success("Backup codes copied", {
			description: "Backup codes have been copied to your clipboard.",
		})
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
						<Button variant="outline" onClick={() => startSetup()}>
							Reconfigure authenticator app
						</Button>
					</CardFooter>
				)}
			</Card>

			{/* Setup Dialog */}
			<Dialog open={showSetupDialog} onOpenChange={setShowSetupDialog}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Set up two-factor authentication</DialogTitle>
						<DialogDescription>
							Scan the QR code with your authenticator app or enter the setup key manually.
						</DialogDescription>
					</DialogHeader>

					<div className="flex flex-col items-center space-y-4">
						{setupData?.otpauth && (
							<div className="border border-border p-4 rounded-lg">
								<QRCodeSVG value={setupData.otpauth} size={200} level="H" />
							</div>
						)}

						{setupData?.secret && (
							<div className="text-sm text-center">
								<p className="font-medium">Setup key</p>
								<p className="font-mono bg-muted p-2 rounded mt-1">{setupData.secret}</p>
							</div>
						)}

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

			{/* Backup Codes Dialog */}
			<Dialog open={showBackupCodes} onOpenChange={setShowBackupCodes}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Backup Codes</DialogTitle>
						<DialogDescription>
							Save these backup codes in a secure place. You can use them to access your account if you lose your
							authenticator device.
						</DialogDescription>
					</DialogHeader>

					<div className="bg-muted p-4 rounded-md font-mono text-sm">
						{backupCodes.map((code, index) => (
							<div key={index} className="py-1">
								{code}
							</div>
						))}
					</div>

					<DialogFooter>
						<Button variant="outline" onClick={copyBackupCodes}>
							Copy Codes
						</Button>
						<Button onClick={() => setShowBackupCodes(false)}>Done</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	)
}


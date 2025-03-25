"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Laptop, Smartphone, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import { formatRelativeTime } from "@/lib/format"

interface Session {
	id: string
	device: string
	browser: string
	location: string
	ip: string
	lastActive: string
	isCurrent: boolean
	deviceType: string
	expires: string
}

export function SessionsTable() {
	const [sessions, setSessions] = useState<Session[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [isRevoking, setIsRevoking] = useState(false)

	useEffect(() => {
		fetchSessions()
	}, [])

	async function fetchSessions() {
		try {
			setIsLoading(true)
			const response = await fetch("/api/user/security/sessions")

			if (!response.ok) {
				throw new Error("Failed to fetch sessions")
			}

			const data = await response.json()
			setSessions(data.sessions || [])
		} catch (error) {
			console.error("Error fetching sessions:", error)
			toast.error("Error", {
				description: "Failed to load active sessions. Please try again.",
			})
		} finally {
			setIsLoading(false)
		}
	}

	async function handleRevoke(sessionId: string) {
		try {
			setIsRevoking(true)
			const response = await fetch(`/api/user/security/sessions?id=${sessionId}`, {
				method: "DELETE",
			})

			if (!response.ok) {
				throw new Error("Failed to revoke session")
			}

			setSessions(sessions.filter((session) => session.id !== sessionId))
			toast.success("Session revoked", {
				description: "The session has been successfully revoked.",
			})
		} catch (error) {
			console.error("Error revoking session:", error)
			toast.error("Error", {
				description: "Failed to revoke session. Please try again.",
			})
		} finally {
			setIsRevoking(false)
		}
	}

	async function handleRevokeAll() {
		try {
			setIsRevoking(true)
			const response = await fetch("/api/user/security/sessions", {
				method: "PATCH",
			})

			if (!response.ok) {
				throw new Error("Failed to revoke all sessions")
			}

			// Keep only the current session
			const currentSession = sessions.find((session) => session.isCurrent)
			setSessions(currentSession ? [currentSession] : [])

			toast.success("All sessions revoked", {
				description: "All other sessions have been successfully revoked.",
			})
		} catch (error) {
			console.error("Error revoking all sessions:", error)
			toast.error("Error", {
				description: "Failed to revoke all sessions. Please try again.",
			})
		} finally {
			setIsRevoking(false)
		}
	}

	function getDeviceIcon(deviceType: string) {
		switch (deviceType) {
			case "desktop":
				return <Laptop className="h-4 w-4" />
			case "mobile":
				return <Smartphone className="h-4 w-4" />
			default:
				return <AlertCircle className="h-4 w-4" />
		}
	}

	if (isLoading) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Active Sessions</CardTitle>
					<CardDescription>Loading your active sessions...</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="h-40 flex items-center justify-center">
						<p>Loading sessions...</p>
					</div>
				</CardContent>
			</Card>
		)
	}

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between">
				<div>
					<CardTitle>Active Sessions</CardTitle>
					<CardDescription>Manage your active sessions across devices.</CardDescription>
				</div>
				<Button variant="outline" onClick={handleRevokeAll} disabled={isRevoking || sessions.length <= 1}>
					Sign out all other devices
				</Button>
			</CardHeader>
			<CardContent>
				{sessions.length === 0 ? (
					<div className="text-center py-8">
						<p className="text-muted-foreground">No active sessions found</p>
					</div>
				) : (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Device</TableHead>
								<TableHead>Location</TableHead>
								<TableHead>Last Active</TableHead>
								<TableHead className="text-right">Action</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{sessions.map((session) => (
								<TableRow key={session.id}>
									<TableCell>
										<div className="flex items-center space-x-2">
											{getDeviceIcon(session.deviceType)}
											<div>
												<div className="font-medium">{session.device}</div>
												<div className="text-xs text-muted-foreground">{session.browser}</div>
												{session.isCurrent && (
													<Badge variant="outline" className="mt-1">
														Current
													</Badge>
												)}
											</div>
										</div>
									</TableCell>
									<TableCell>
										<div>{session.location}</div>
										<div className="text-xs text-muted-foreground">{session.ip}</div>
									</TableCell>
									<TableCell>{formatRelativeTime(new Date(session.lastActive))}</TableCell>
									<TableCell className="text-right">
										<Button
											variant="ghost"
											size="sm"
											onClick={() => handleRevoke(session.id)}
											disabled={isRevoking || session.isCurrent}
										>
											{session.isCurrent ? "Current" : "Revoke"}
										</Button>
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


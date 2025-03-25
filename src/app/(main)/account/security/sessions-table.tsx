"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Laptop, Smartphone, AlertCircle } from "lucide-react"
import {toast} from "sonner";

// Mock data for active sessions
const mockSessions = [
	{
		id: "1",
		device: "Windows PC",
		browser: "Chrome",
		location: "New York, USA",
		ip: "192.168.1.1",
		lastActive: "Just now",
		isCurrent: true,
		deviceType: "desktop",
	},
	{
		id: "2",
		device: "iPhone 13",
		browser: "Safari",
		location: "Los Angeles, USA",
		ip: "192.168.1.2",
		lastActive: "2 hours ago",
		isCurrent: false,
		deviceType: "mobile",
	},
	{
		id: "3",
		device: "Unknown",
		browser: "Firefox",
		location: "London, UK",
		ip: "192.168.1.3",
		lastActive: "3 days ago",
		isCurrent: false,
		deviceType: "unknown",
	},
]

export function SessionsTable() {
	const [sessions, setSessions] = useState(mockSessions)
	const [isLoading, setIsLoading] = useState(false)

	async function handleRevoke(sessionId: string) {
		setIsLoading(true)

		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 1000))

		setSessions(sessions.filter((session) => session.id !== sessionId))
		toast.success("Session revoked",{
			description: "The session has been successfully revoked.",
		})

		setIsLoading(false)
	}

	async function handleRevokeAll() {
		setIsLoading(true)

		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 1000))

		const currentSession = sessions.find((session) => session.isCurrent)
		setSessions(currentSession ? [currentSession] : [])
		toast.success("All sessions revoked",{
			description: "All other sessions have been successfully revoked.",
		})

		setIsLoading(false)
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

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between">
				<div>
					<CardTitle>Active Sessions</CardTitle>
					<CardDescription>Manage your active sessions across devices.</CardDescription>
				</div>
				<Button variant="outline" onClick={handleRevokeAll} disabled={isLoading || sessions.length <= 1}>
					Sign out all other devices
				</Button>
			</CardHeader>
			<CardContent>
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
								<TableCell>{session.lastActive}</TableCell>
								<TableCell className="text-right">
									<Button
										variant="ghost"
										size="sm"
										onClick={() => handleRevoke(session.id)}
										disabled={isLoading || session.isCurrent}
									>
										{session.isCurrent ? "Current" : "Revoke"}
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	)
}


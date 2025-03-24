"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import {toast} from "sonner";

export function PreferencesForm() {
	const [isLoading, setIsLoading] = useState(false)

	// Preferences state
	const [language, setLanguage] = useState("english")
	const [theme, setTheme] = useState("system")
	const [timezone, setTimezone] = useState("auto")
	const [dateFormat, setDateFormat] = useState("MM/DD/YYYY")
	const [compactMode, setCompactMode] = useState(false)
	const [animations, setAnimations] = useState(true)
	const [autoSave, setAutoSave] = useState(true)

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault()
		setIsLoading(true)

		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 1000))

		toast.success("Preferences updated",{
			description: "Your preferences have been saved successfully.",
		})

		setIsLoading(false)
	}

	return (
		<form onSubmit={onSubmit}>
			<Card>
				<CardHeader>
					<CardTitle>Application Preferences</CardTitle>
					<CardDescription>Customize how the application looks and behaves.</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="space-y-4">
						<h4 className="text-sm font-medium">Appearance</h4>

						<div className="grid gap-4">
							<div className="space-y-2">
								<Label htmlFor="theme">Theme</Label>
								<RadioGroup id="theme" value={theme} onValueChange={setTheme} className="flex space-x-4">
									<div className="flex items-center space-x-2">
										<RadioGroupItem value="light" id="theme-light" />
										<Label htmlFor="theme-light">Light</Label>
									</div>
									<div className="flex items-center space-x-2">
										<RadioGroupItem value="dark" id="theme-dark" />
										<Label htmlFor="theme-dark">Dark</Label>
									</div>
									<div className="flex items-center space-x-2">
										<RadioGroupItem value="system" id="theme-system" />
										<Label htmlFor="theme-system">System</Label>
									</div>
								</RadioGroup>
							</div>

							<div className="space-y-2">
								<Label htmlFor="compact-mode">Compact Mode</Label>
								<div className="flex items-center space-x-2">
									<Switch id="compact-mode" checked={compactMode} onCheckedChange={setCompactMode} />
									<Label htmlFor="compact-mode">Use less spacing between elements</Label>
								</div>
							</div>

							<div className="space-y-2">
								<Label htmlFor="animations">Animations</Label>
								<div className="flex items-center space-x-2">
									<Switch id="animations" checked={animations} onCheckedChange={setAnimations} />
									<Label htmlFor="animations">Enable animations and transitions</Label>
								</div>
							</div>
						</div>
					</div>

					<Separator />

					<div className="space-y-4">
						<h4 className="text-sm font-medium">Localization</h4>

						<div className="grid gap-4">
							<div className="space-y-2">
								<Label htmlFor="language">Language</Label>
								<Select value={language} onValueChange={setLanguage}>
									<SelectTrigger id="language">
										<SelectValue placeholder="Select language" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="english">English</SelectItem>
										<SelectItem value="spanish">Spanish</SelectItem>
										<SelectItem value="french">French</SelectItem>
										<SelectItem value="german">German</SelectItem>
										<SelectItem value="japanese">Japanese</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-2">
								<Label htmlFor="timezone">Timezone</Label>
								<Select value={timezone} onValueChange={setTimezone}>
									<SelectTrigger id="timezone">
										<SelectValue placeholder="Select timezone" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="auto">Auto-detect</SelectItem>
										<SelectItem value="utc">UTC</SelectItem>
										<SelectItem value="est">Eastern Time (ET)</SelectItem>
										<SelectItem value="cst">Central Time (CT)</SelectItem>
										<SelectItem value="mst">Mountain Time (MT)</SelectItem>
										<SelectItem value="pst">Pacific Time (PT)</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-2">
								<Label htmlFor="date-format">Date Format</Label>
								<Select value={dateFormat} onValueChange={setDateFormat}>
									<SelectTrigger id="date-format">
										<SelectValue placeholder="Select date format" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
										<SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
										<SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>
					</div>

					<Separator />

					<div className="space-y-4">
						<h4 className="text-sm font-medium">Behavior</h4>

						<div className="space-y-2">
							<Label htmlFor="auto-save">Auto-save</Label>
							<div className="flex items-center space-x-2">
								<Switch id="auto-save" checked={autoSave} onCheckedChange={setAutoSave} />
								<Label htmlFor="auto-save">Automatically save changes as you work</Label>
							</div>
						</div>
					</div>
				</CardContent>
				<CardFooter>
					<Button type="submit" disabled={isLoading}>
						{isLoading ? "Saving..." : "Save preferences"}
					</Button>
				</CardFooter>
			</Card>
		</form>
	)
}


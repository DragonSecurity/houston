"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {toast} from "sonner";

export function NotificationsForm() {
	const [isLoading, setIsLoading] = useState(false)

	// Email notification preferences
	const [emailPrefs, setEmailPrefs] = useState({
		marketing: true,
		social: true,
		security: true,
		updates: true,
		newsletter: false,
	})

	// Push notification preferences
	const [pushPrefs, setPushPrefs] = useState({
		marketing: false,
		social: true,
		security: true,
		updates: false,
		newsletter: false,
	})

	async function onSubmit() {
		setIsLoading(true)

		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 1000))

		toast.success("Preferences updated",{
			description: "Your notification preferences have been saved.",
		})

		setIsLoading(false)
	}

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault()
				onSubmit()
			}}
		>
			<Tabs defaultValue="email" className="w-full">
				<TabsList className="grid w-full grid-cols-2">
					<TabsTrigger value="email">Email</TabsTrigger>
					<TabsTrigger value="push">Push Notifications</TabsTrigger>
				</TabsList>

				<TabsContent value="email">
					<Card>
						<CardHeader>
							<CardTitle>Email Notifications</CardTitle>
							<CardDescription>Configure which emails you want to receive.</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="flex items-center justify-between space-x-2">
								<Label htmlFor="email-marketing" className="flex flex-col space-y-1">
									<span>Marketing emails</span>
									<span className="text-xs font-normal text-muted-foreground">
                    Receive emails about new products, features, and more.
                  </span>
								</Label>
								<Switch
									id="email-marketing"
									checked={emailPrefs.marketing}
									onCheckedChange={(checked) => setEmailPrefs({ ...emailPrefs, marketing: checked })}
								/>
							</div>

							<div className="flex items-center justify-between space-x-2">
								<Label htmlFor="email-social" className="flex flex-col space-y-1">
									<span>Social notifications</span>
									<span className="text-xs font-normal text-muted-foreground">
                    Receive emails for friend requests, follows, and more.
                  </span>
								</Label>
								<Switch
									id="email-social"
									checked={emailPrefs.social}
									onCheckedChange={(checked) => setEmailPrefs({ ...emailPrefs, social: checked })}
								/>
							</div>

							<div className="flex items-center justify-between space-x-2">
								<Label htmlFor="email-security" className="flex flex-col space-y-1">
									<span>Security emails</span>
									<span className="text-xs font-normal text-muted-foreground">
                    Receive emails about your account activity and security.
                  </span>
								</Label>
								<Switch
									id="email-security"
									checked={emailPrefs.security}
									onCheckedChange={(checked) => setEmailPrefs({ ...emailPrefs, security: checked })}
								/>
							</div>

							<div className="flex items-center justify-between space-x-2">
								<Label htmlFor="email-updates" className="flex flex-col space-y-1">
									<span>Product updates</span>
									<span className="text-xs font-normal text-muted-foreground">
                    Receive emails about updates to products you&#39;ve purchased.
                  </span>
								</Label>
								<Switch
									id="email-updates"
									checked={emailPrefs.updates}
									onCheckedChange={(checked) => setEmailPrefs({ ...emailPrefs, updates: checked })}
								/>
							</div>

							<div className="flex items-center justify-between space-x-2">
								<Label htmlFor="email-newsletter" className="flex flex-col space-y-1">
									<span>Newsletter</span>
									<span className="text-xs font-normal text-muted-foreground">
                    Receive our monthly newsletter with the latest insights.
                  </span>
								</Label>
								<Switch
									id="email-newsletter"
									checked={emailPrefs.newsletter}
									onCheckedChange={(checked) => setEmailPrefs({ ...emailPrefs, newsletter: checked })}
								/>
							</div>
						</CardContent>
						<CardFooter>
							<Button type="submit" disabled={isLoading}>
								{isLoading ? "Saving..." : "Save changes"}
							</Button>
						</CardFooter>
					</Card>
				</TabsContent>

				<TabsContent value="push">
					<Card>
						<CardHeader>
							<CardTitle>Push Notifications</CardTitle>
							<CardDescription>Configure which push notifications you want to receive on your devices.</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="flex items-center justify-between space-x-2">
								<Label htmlFor="push-marketing" className="flex flex-col space-y-1">
									<span>Marketing notifications</span>
									<span className="text-xs font-normal text-muted-foreground">
                    Receive notifications about new products, features, and more.
                  </span>
								</Label>
								<Switch
									id="push-marketing"
									checked={pushPrefs.marketing}
									onCheckedChange={(checked) => setPushPrefs({ ...pushPrefs, marketing: checked })}
								/>
							</div>

							<div className="flex items-center justify-between space-x-2">
								<Label htmlFor="push-social" className="flex flex-col space-y-1">
									<span>Social notifications</span>
									<span className="text-xs font-normal text-muted-foreground">
                    Receive notifications for friend requests, follows, and more.
                  </span>
								</Label>
								<Switch
									id="push-social"
									checked={pushPrefs.social}
									onCheckedChange={(checked) => setPushPrefs({ ...pushPrefs, social: checked })}
								/>
							</div>

							<div className="flex items-center justify-between space-x-2">
								<Label htmlFor="push-security" className="flex flex-col space-y-1">
									<span>Security notifications</span>
									<span className="text-xs font-normal text-muted-foreground">
                    Receive notifications about your account activity and security.
                  </span>
								</Label>
								<Switch
									id="push-security"
									checked={pushPrefs.security}
									onCheckedChange={(checked) => setPushPrefs({ ...pushPrefs, security: checked })}
								/>
							</div>

							<div className="flex items-center justify-between space-x-2">
								<Label htmlFor="push-updates" className="flex flex-col space-y-1">
									<span>Product updates</span>
									<span className="text-xs font-normal text-muted-foreground">
                    Receive notifications about updates to products you&#39;ve purchased.
                  </span>
								</Label>
								<Switch
									id="push-updates"
									checked={pushPrefs.updates}
									onCheckedChange={(checked) => setPushPrefs({ ...pushPrefs, updates: checked })}
								/>
							</div>

							<div className="flex items-center justify-between space-x-2">
								<Label htmlFor="push-newsletter" className="flex flex-col space-y-1">
									<span>Newsletter</span>
									<span className="text-xs font-normal text-muted-foreground">
                    Receive our monthly newsletter with the latest insights.
                  </span>
								</Label>
								<Switch
									id="push-newsletter"
									checked={pushPrefs.newsletter}
									onCheckedChange={(checked) => setPushPrefs({ ...pushPrefs, newsletter: checked })}
								/>
							</div>
						</CardContent>
						<CardFooter>
							<Button type="submit" disabled={isLoading}>
								{isLoading ? "Saving..." : "Save changes"}
							</Button>
						</CardFooter>
					</Card>
				</TabsContent>
			</Tabs>
		</form>
	)
}


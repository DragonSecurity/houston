"use client"

import {useEffect, useState} from "react";
import {signIn} from "next-auth/react";
import {Button} from "@/components/ui/button";
import {Separator} from "@/components/ui/separator";
import {FaFacebook, FaGoogle, FaTwitter} from "react-icons/fa6";

interface SocialSigninProps {
	signup?: boolean
	invite?: string
}

export function SocialSignin({ signup, invite }: SocialSigninProps) {
	const [providers, setProviders] = useState<{
		facebook: boolean
		twitter: boolean
		google: boolean
	}>({
		facebook: false,
		twitter: false,
		google: false,
	})

	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const fetchProviders = async () => {
			try {
				const res = await fetch("/api/auth/providers")
				const data = await res.json()
				setProviders(data)
			} catch (error) {
				console.error("Failed to fetch providers:", error)
			} finally {
				setLoading(false)
			}
		}

		fetchProviders()
	}, [])

	const social_active = providers.facebook || providers.twitter || providers.google

	return (
		<div className="flex flex-col w-full gap-2">
			{providers.facebook && (
				<Button
					variant="outline"
					className="w-full"
					onClick={() => signIn("facebook", { callbackUrl: signup ? "/signup/verify" : "/dashboard" })}
				>
					<FaFacebook className="mr-2 h-4 w-4" />
					{signup ? "Sign up with Facebook" : "Sign in with Facebook"}
				</Button>
			)}

			{providers.twitter && (
				<Button
					variant="outline"
					className="w-full"
					onClick={() => signIn("twitter", { callbackUrl: signup ? "/signup/verify" : "/dashboard" })}
				>
					<FaTwitter className="mr-2 h-4 w-4" />
					{signup ? "Sign up with Twitter" : "Sign in with Twitter"}
				</Button>
			)}

			{providers.google && (
				<Button
					variant="outline"
					className="w-full"
					onClick={() => signIn("google", { callbackUrl: signup ? "/signup/verify" : "/dashboard" })}
				>
					<FaGoogle className="mr-2 h-4 w-4" />
					{signup ? "Sign up with Google" : "Sign in with Google"}
				</Button>
			)}

			{social_active && (
				<Separator className="my-4 flex items-center justify-center">or</Separator>
			)}
		</div>
	)
}


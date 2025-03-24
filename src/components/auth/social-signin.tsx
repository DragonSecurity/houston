"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Facebook, Twitter } from "lucide-react";

interface SocialSigninProps {
  signup?: boolean;
  invite?: string;
}

export function SocialSignin({ signup, invite }: SocialSigninProps) {
  return (
    <div className="flex flex-col w-full gap-2">
      <Button
        variant="outline"
        className="w-full"
        onClick={() =>
          signIn("facebook", {
            callbackUrl: signup ? "/signup/verify" : "/dashboard",
          })
        }
      >
        <Facebook className="mr-2 h-4 w-4" />
        {signup ? "Sign up with Facebook" : "Sign in with Facebook"}
      </Button>

      <Button
        variant="outline"
        className="w-full"
        onClick={() =>
          signIn("twitter", {
            callbackUrl: signup ? "/signup/verify" : "/dashboard",
          })
        }
      >
        <Twitter className="mr-2 h-4 w-4" />
        {signup ? "Sign up with Twitter" : "Sign in with Twitter"}
      </Button>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";

export function VerifyEmail() {
  const searchParams = useSearchParams();
  const [alertState, setAlertState] = useState<{
    variant: "default" | "destructive" | null;
    title: string;
    description: string;
    action?: () => void;
    actionText?: string;
  }>({
    variant: "default",
    title: "Please Check Your Email",
    description:
      "Please click the link in the email we sent to verify your account.",
    action: resendVerificationEmail,
    actionText: "Re-Send Verification Email",
  });

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      verifyToken(token);
    }
  }, [searchParams]);

  async function verifyToken(token: string) {
    setAlertState({
      variant: "default",
      title: "Verifying...",
      description: "Please wait a moment while we verify your email.",
    });

    try {
      const response = await fetch("/api/user/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        throw new Error("Verification failed");
      }

      // Redirect to dashboard or plan selection
      window.location.href = "/dashboard";
    } catch (error) {
      setAlertState({
        variant: "destructive",
        title: "Verification Link Has Expired",
        description: "Please re-send the verification email and try again.",
        action: resendVerificationEmail,
        actionText: "Re-Send Verification Email",
      });
    }
  }

  async function resendVerificationEmail() {
    try {
      const response = await fetch("/api/user/verify/request", {
        method: "POST",
      });

      console.log(response);

      if (response.ok) {
        toast.success("Verification Email Sent", {
          description: "Please check your email for the verification link.",
        });
      }
    } catch (error) {
      toast.error("Failed to send verification email", {
        description: "Please try again later.",
      });
    }
  }

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto space-y-6 p-6">
      <h1 className="text-3xl font-semibold text-center text-primary">
        Verify Your Email Address
      </h1>

      <Alert variant={alertState.variant || "default"}>
        <AlertTitle>{alertState.title}</AlertTitle>
        <AlertDescription>{alertState.description}</AlertDescription>
        {alertState.action && (
          <Button
            variant="outline"
            className="mt-4"
            onClick={alertState.action}
          >
            {alertState.actionText}
          </Button>
        )}
      </Alert>

      <div className="text-center text-sm">
        <Link href="/account/profile" className="text-primary hover:underline">
          Manage Your Account
        </Link>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { SocialSignin } from "./social-signin";
import { toast } from "sonner";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export function SignIn() {
  const router = useRouter();
  const [useMagic, setUseMagic] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    if (useMagic) {
      // Handle magic link signin
      try {
        await signIn("email", {
          email: values.email,
          redirect: false,
        });

        toast.success("Check Your Email", {
          description: "Please click the link in your email inbox to sign in.",
        });
      } catch (error) {
        toast.error("Something went wrong. Please try again.");
      }
    } else {
      // Handle password signin
      try {
        const result = await signIn("credentials", {
          email: values.email,
          password: values.password,
          redirect: false,
        });

        if (result?.error) {
          toast.error("Sign in failed. Your email or password is incorrect.");
        } else {
          router.push("/dashboard");
        }
      } catch (error) {
        toast.error("Something went wrong. Please try again.");
      }
    }

    setIsLoading(false);
  }

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto space-y-6 p-6">
      <h1 className="text-3xl font-semibold text-center text-primary">
        Sign in to Houston
      </h1>

      <SocialSignin />

      <Separator className="my-4">or</Separator>

      <Button
        variant="outline"
        className="w-full"
        onClick={() => setUseMagic(!useMagic)}
      >
        {useMagic ? "Use password" : "Use magic link"}
      </Button>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 w-full"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="name@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {!useMagic && (
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading
              ? "Loading..."
              : useMagic
                ? "Send Magic Link"
                : "Sign In"}
          </Button>
        </form>
      </Form>

      {!useMagic && (
        <Link
          href="/forgot-password"
          className="text-sm text-primary hover:underline"
        >
          Forgot your password?
        </Link>
      )}

      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-primary hover:underline">
          Sign Up
        </Link>
      </div>
    </div>
  );
}

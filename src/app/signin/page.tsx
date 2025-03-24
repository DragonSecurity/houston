import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SignIn } from "@/components/auth/signin";

export default async function Home() {
  const session = await getServerSession(authOptions);

  // If user is authenticated, redirect to dashboard
  if (session) {
    redirect("/dashboard");
  }

  return <SignIn />;
}

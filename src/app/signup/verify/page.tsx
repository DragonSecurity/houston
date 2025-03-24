import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { VerifyEmail } from "@/components/auth/verify-email";

export default async function VerifyPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  return <VerifyEmail />;
}

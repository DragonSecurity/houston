import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendVerificationEmail } from "@/lib/email";
import crypto from "crypto";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Generate verification token
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Store token in database
    await prisma.verificationToken.create({
      data: {
        identifier: user.email,
        token,
        expires,
      },
    });

    // Send verification email
    await sendVerificationEmail(
      { name: user.name || "User", email: user.email },
      token,
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Verification request error:", error);
    return NextResponse.json(
      { error: "Failed to send verification email" },
      { status: 500 },
    );
  }
}

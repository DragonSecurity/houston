import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import WelcomeEmail from "@/emails/welcome-email";
import VerificationEmail from "@/emails/verification-email";
import PasswordResetEmail from "@/emails/password-reset-email";

// Create a Nodemailer transporter using SMTP
export const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT),
  secure: Number(process.env.EMAIL_SERVER_PORT) === 465, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

export type SendEmailParams = {
  to: string;
  subject: string;
  html: string;
};

export async function sendEmail({ to, subject, html }: SendEmailParams) {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    });

    console.log(`Email sent: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error };
  }
}

export async function sendWelcomeEmail(user: { name: string; email: string }) {
  const html = await render(WelcomeEmail({ name: user.name }));

  return sendEmail({
    to: user.email,
    subject: "Welcome to Houston!",
    html,
  });
}

export async function sendVerificationEmail(
  user: { name: string; email: string },
  token: string,
) {
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`;
  const html = await render(
    VerificationEmail({ name: user.name, verificationUrl }),
  );

  return sendEmail({
    to: user.email,
    subject: "Verify your email address",
    html,
  });
}

export async function sendPasswordResetEmail(
  user: { name: string; email: string },
  token: string,
) {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;
  const html = await render(PasswordResetEmail({ name: user.name, resetUrl }));

  return sendEmail({
    to: user.email,
    subject: "Reset your password",
    html,
  });
}

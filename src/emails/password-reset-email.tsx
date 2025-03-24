import EmailLayout from "./email-layout";

interface PasswordResetEmailProps {
  name: string;
  resetUrl: string;
}

export default function PasswordResetEmail({
  name,
  resetUrl,
}: PasswordResetEmailProps) {
  return (
    <EmailLayout previewText="Reset your password">
      <h1>Reset Your Password</h1>
      <p>Hi {name},</p>
      <p>
        We received a request to reset your password for your Houston account.
        To proceed with the password reset, please click the button below:
      </p>
      <div style={{ textAlign: "center" }}>
        <a href={resetUrl} className="button">
          Reset Password
        </a>
      </div>
      <p>
        This link will expire in 1 hour. If you did not request a password
        reset, please ignore this email or contact support if you have concerns.
      </p>
      <p>
        If the button above doesn&#39;t work, you can also copy and paste the
        following link into your browser:
      </p>
      <p style={{ wordBreak: "break-all", fontSize: "14px", color: "#6b7280" }}>
        {resetUrl}
      </p>
      <p>
        Best regards,
        <br />
        The Houston Team
      </p>
    </EmailLayout>
  );
}

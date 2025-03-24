import EmailLayout from "./email-layout";

interface VerificationEmailProps {
  name: string;
  verificationUrl: string;
}

export default function VerificationEmail({
  name,
  verificationUrl,
}: VerificationEmailProps) {
  return (
    <EmailLayout previewText="Please verify your email address">
      <h1>Verify Your Email Address</h1>
      <p>Hi {name},</p>
      <p>
        Thank you for registering with Houston. To complete your registration
        and verify your email address, please click the button below:
      </p>
      <div style={{ textAlign: "center" }}>
        <a href={verificationUrl} className="button">
          Verify Email Address
        </a>
      </div>
      <p>
        This link will expire in 24 hours. If you did not create an account with
        Houston, please ignore this email.
      </p>
      <p>
        If the button above doesn&#39;t work, you can also copy and paste the
        following link into your browser:
      </p>
      <p style={{ wordBreak: "break-all", fontSize: "14px", color: "#6b7280" }}>
        {verificationUrl}
      </p>
      <p>
        Best regards,
        <br />
        The Houston Team
      </p>
    </EmailLayout>
  );
}

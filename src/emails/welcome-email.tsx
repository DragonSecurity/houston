import EmailLayout from "./email-layout";

interface WelcomeEmailProps {
  name: string;
}

export default function WelcomeEmail({ name }: WelcomeEmailProps) {
  return (
    <EmailLayout previewText={`Welcome to Houston, ${name}!`}>
      <h1>Welcome to Houston, {name}!</h1>
      <p>
        Thank you for joining Houston. We&#39;re excited to have you on board
        and can&#39;t wait to see what you&#39;ll accomplish with our platform.
      </p>
      <p>
        Houston provides you with all the tools you need to manage your
        projects, collaborate with your team, and grow your business.
      </p>
      <div style={{ textAlign: "center" }}>
        <a
          href={`${process.env.NEXT_PUBLIC_APP_URL}/dashboard`}
          className="button"
        >
          Get Started
        </a>
      </div>
      <p>
        If you have any questions or need assistance, our support team is always
        here to help.
      </p>
      <p>
        Best regards,
        <br />
        The Houston Team
      </p>
    </EmailLayout>
  );
}

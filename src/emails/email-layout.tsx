import type React from "react";

interface EmailLayoutProps {
  children: React.ReactNode;
  previewText?: string;
}

export default function EmailLayout({
  children,
  previewText = "",
}: EmailLayoutProps) {
  return (
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <title>Houston Email</title>
        {previewText && <meta name="description" content={previewText} />}
        <style
          dangerouslySetInnerHTML={{
            __html: `
          /* Base styles */
          body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            -webkit-font-smoothing: antialiased;
            font-size: 16px;
            line-height: 1.4;
            margin: 0;
            padding: 0;
            -ms-text-size-adjust: 100%;
            -webkit-text-size-adjust: 100%;
            background-color: #f6f9fc;
            color: #333;
          }
          
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          
          .content {
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
            padding: 30px;
          }
          
          .header {
            text-align: center;
            padding-bottom: 20px;
          }
          
          .logo {
            max-width: 120px;
            margin-bottom: 20px;
          }
          
          .footer {
            text-align: center;
            color: #9ca3af;
            font-size: 14px;
            margin-top: 30px;
          }
          
          .button {
            background-color: #10b981;
            border-radius: 4px;
            color: white;
            display: inline-block;
            font-weight: 600;
            padding: 12px 24px;
            text-decoration: none;
            text-align: center;
            margin: 20px 0;
          }
          
          h1 {
            color: #111827;
            font-size: 24px;
            font-weight: 700;
            margin-bottom: 20px;
          }
          
          p {
            margin-bottom: 16px;
            color: #4b5563;
          }
        `,
          }}
        />
      </head>
      <body>
        <div className="container">
          <div className="content">
            <div className="header">
              <img
                src={`${process.env.NEXT_PUBLIC_APP_URL}/logo.png`}
                alt="Houston Logo"
                className="logo"
              />
            </div>
            {children}
          </div>
          <div className="footer">
            <p>© {new Date().getFullYear()} Houston. All rights reserved.</p>
            <p>
              If you have any questions, please contact us at{" "}
              <a href={`mailto:${process.env.EMAIL_FROM}`}>
                {process.env.EMAIL_FROM}
              </a>
            </p>
          </div>
        </div>
      </body>
    </html>
  );
}

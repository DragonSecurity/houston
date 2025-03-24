import "@/styles/globals.css";
import { Metadata } from "next";
import { ReactNode } from "react";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/components/auth-provider";
import { ThemeProvider } from "next-themes";

const inter = Inter({ subsets: ["latin"] });


export const metadata: Metadata = {
  title: "Houston",
  description: "Modern SaaS application platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/fav/rocket.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/fav/rocket.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/fav/rocket.png"
        />
      </head>
      <body className={`${inter.className} font-sans`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
            <Toaster richColors closeButton position="top-center" />
          </AuthProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}

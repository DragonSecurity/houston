"use client";

import * as Sentry from "@sentry/nextjs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // Log the error to Sentry
  Sentry.captureException(error);

  return (
    <html>
      <body>
        <div className="flex items-center justify-center min-h-screen p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Something went wrong</CardTitle>
              <CardDescription>
                We&#39;ve been notified about this issue and we&#39;re working
                on a fix.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                <p>Error: {error.message}</p>
                {error.digest && (
                  <p className="mt-2">Error ID: {error.digest}</p>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => (window.location.href = "/")}
              >
                Go Home
              </Button>
              <Button onClick={reset}>Try Again</Button>
            </CardFooter>
          </Card>
        </div>
      </body>
    </html>
  );
}

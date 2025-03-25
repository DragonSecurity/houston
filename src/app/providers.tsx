"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { QueryProvider } from "@/providers/query-provider";
import { SonnerProvider } from "@/components/sonner-provider";
import type { ReactNode } from "react";
import {AuthProvider} from "@/components/auth-provider";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider>
      <QueryProvider>
        {children}
        <SonnerProvider />
      </QueryProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

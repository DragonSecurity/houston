"use client";

import { Toaster as SonnerToaster } from "sonner";

export function SonnerProvider() {

  return (
    <SonnerToaster
      position="top-center"
      closeButton
      richColors
    />
  );
}

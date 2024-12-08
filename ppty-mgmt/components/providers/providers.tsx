"use client";

import { ThemeProvider } from "@/components/theme/theme-provider";
import { UploadthingProvider } from "./uploadthing-provider";
import { Toaster } from "@/components/ui/toaster";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <UploadthingProvider>
        {children}
        <Toaster />
      </UploadthingProvider>
    </ThemeProvider>
  );
}
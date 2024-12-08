import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider, SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import { Providers } from "@/components/providers/providers";
import "./globals.css";
import { ModeToggle } from "@/components/theme/mode-toggle";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Property Management Tool",
  description: "A tool to help manage your properties!",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <Providers>
            <header className="border-b">
              <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <h1 className="text-2xl font-bold">Welcome! --- in testing</h1>
                <div className="flex items-center gap-4">
                  <ModeToggle />
                  <SignedOut>
                    <SignInButton mode="modal">
                      <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md">
                        Sign In
                      </button>
                    </SignInButton>
                  </SignedOut>
                  <SignedIn>
                    <UserButton afterSignOutUrl="/" />
                  </SignedIn>
                </div>
              </div>
            </header>
            <main className="container mx-auto px-4 py-6">
              {children}
            </main>
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}


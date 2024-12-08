import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { ArrowRight, Building2, Users, Shield, Wrench } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex-1 space-y-16 pt-6 pb-8 md:pb-12 md:pt-10 lg:py-16">
      <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
        <h1 className="text-4xl font-bold sm:text-5xl md:text-6xl lg:text-7xl">
          Manage your properties{" "}
          <span className="text-primary">with ease</span>
        </h1>
        <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
          Streamline your property management with our comprehensive tool. Handle tenants, 
          maintenance, and payments all in one place.
        </p>
        <div className="flex gap-4">
          <SignedOut>
            <SignInButton mode="modal">
              <Button size="lg">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <Link href="/dashboard">
              <Button size="lg">
                Go to Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </SignedIn>
        </div>
      </div>

      <div className="container">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col items-center space-y-4 rounded-lg border p-6">
            <div className="rounded-full bg-primary/10 p-3">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Property Management</h3>
            <p className="text-center text-muted-foreground">
              Easily manage multiple properties, units, and track occupancy rates.
            </p>
          </div>

          <div className="flex flex-col items-center space-y-4 rounded-lg border p-6">
            <div className="rounded-full bg-primary/10 p-3">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Tenant Portal</h3>
            <p className="text-center text-muted-foreground">
              Handle tenant applications, leases, and communications efficiently.
            </p>
          </div>

          <div className="flex flex-col items-center space-y-4 rounded-lg border p-6">
            <div className="rounded-full bg-primary/10 p-3">
              <Wrench className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Maintenance Tracking</h3>
            <p className="text-center text-muted-foreground">
              Track and manage maintenance requests and repairs in real-time.
            </p>
          </div>

          <div className="flex flex-col items-center space-y-4 rounded-lg border p-6">
            <div className="rounded-full bg-primary/10 p-3">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Secure Payments</h3>
            <p className="text-center text-muted-foreground">
              Process rent payments and track financial transactions securely.
            </p>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="flex flex-col space-y-8 p-8 md:p-12 lg:p-16">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold">Ready to streamline your property management?</h2>
              <p className="text-muted-foreground">
                Join thousands of property managers who are already saving time and 
                increasing efficiency with our platform.
              </p>
            </div>
            <div className="flex flex-col gap-4 md:flex-row">
              <SignedOut>
                <SignInButton mode="modal">
                  <Button size="lg">
                    Start Managing Properties
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <Link href="/dashboard">
                  <Button size="lg">
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </SignedIn>
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>

      <footer className="border-t">
        <div className="container flex flex-col gap-4 py-8 md:flex-row md:items-center md:justify-between">
          <p className="text-center text-sm text-muted-foreground md:text-left">
            Built with Next.js 14, Tailwind CSS, and Clerk Authentication.
          </p>
          <div className="flex items-center justify-center gap-4 md:justify-end">
            <Link 
              href="/terms" 
              className="text-sm text-muted-foreground hover:underline"
            >
              Terms
            </Link>
            <Link 
              href="/privacy" 
              className="text-sm text-muted-foreground hover:underline"
            >
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
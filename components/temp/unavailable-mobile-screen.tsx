import React from "react";
import { ArrowLeft, Smartphone, Laptop } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";

export default function UnavailableMobileScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-b from-background to-secondary/20">
      <div className="w-full max-w-md p-8 space-y-6 text-center bg-background rounded-xl shadow-lg border border-border/30">
        <div className="flex justify-center mb-2">
          <div className="p-4 rounded-full bg-secondary/30">
            <Smartphone className="w-12 h-12 text-primary" />
          </div>
        </div>

        <h1 className="text-3xl font-bold tracking-tight">
          Unavailable on Mobile
        </h1>

        <div className="space-y-3 text-muted-foreground">
          <p className="text-base">
            We're working on making this feature available on mobile devices.
          </p>
          <div className="flex items-center justify-center gap-2 py-2">
            <Smartphone className="w-5 h-5 text-muted-foreground/70" />
            <span className="text-sm">→</span>
            <Laptop className="w-6 h-6 text-primary" />
          </div>
          <p className="text-base font-medium">
            Please use a desktop browser for the full experience.
          </p>
        </div>

        <div className="pt-2">
          <p className="text-sm text-muted-foreground/80">
            Need help? Contact us at{" "}
            <a
              href="mailto:support@dotheon.com"
              className="font-medium text-primary hover:underline"
            >
              support@dotheon.com
            </a>
          </p>
        </div>

        <Link href="https://dotheon.com" className="block mt-4">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Return to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}

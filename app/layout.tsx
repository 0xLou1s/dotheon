import type { Metadata } from "next";
import Providers from "@/providers";
import "@rainbow-me/rainbowkit/styles.css";
import "@/styles/globals.css";
import TopLoader from "@/components/top-loader";
import { Manrope, JetBrains_Mono, Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import { Analytics } from "@vercel/analytics/react";
import UnavailableMobileScreen from "@/components/temp/unavailable-mobile-screen";

const fontSans = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
});

const fontMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const fontHeading = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Dotheon | DeFi Yield Dashboard & Onboarding Guide for Bifrost",
    template: "%s | Dotheon",
  },
  description: "DeFi Yield Dashboard & Onboarding Guide for Bifrost",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
          fontHeading.variable,
          fontMono.variable,
          "[&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
        )}
        suppressHydrationWarning
      >
        <Providers>
          <TopLoader />
          <main className="flex-1">{children}</main>
          <Toaster position="top-center" />
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}

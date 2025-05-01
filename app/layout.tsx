import type { Metadata } from "next";
import Providers from "@/providers";
import "@rainbow-me/rainbowkit/styles.css";
import "./globals.css";
import TopLoader from "@/components/top-loader";
import { IBM_Plex_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
const ibmPlexMonoFont = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-plex-mono",
});

export const metadata: Metadata = {
  title: {
    default: "YieldCraft | DeFi Yield Dashboard & Onboarding Guide for Bifrost",
    template: "%s | YieldCraft",
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
        className={`${ibmPlexMonoFont.className} ${ibmPlexMonoFont.variable} custom-selection antialiased`}
        suppressHydrationWarning
      >
        <Providers>
          <TopLoader />
          <main className="flex-1">{children}</main>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}

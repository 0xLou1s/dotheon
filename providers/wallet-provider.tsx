"use client";

import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Web3OnboardProvider } from "@subwallet-connect/react";
import web3Onboard from "@/lib/web3-onboard";

// Create a client for React Query
const queryClient = new QueryClient();

export function WalletProviders({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Web3OnboardProvider web3Onboard={web3Onboard}>
        {mounted && children}
      </Web3OnboardProvider>
    </QueryClientProvider>
  );
}

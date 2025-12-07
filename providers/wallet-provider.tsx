"use client";

import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Web3OnboardProvider,
  useConnectWallet,
} from "@subwallet-connect/react";
import web3Onboard from "@/lib/web3-onboard";
import { WagmiProvider, createConfig, http } from "wagmi";
import { sepolia, baseSepolia } from "wagmi/chains";
import { Toaster } from "sonner";
import { darkTheme, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { useWalletSync } from "@/hooks/use-wallet-sync";

// Create a client for React Query
const queryClient = new QueryClient();

// Create a wagmi config
const wagmiConfig = createConfig({
  chains: [sepolia, baseSepolia],
  transports: {
    [baseSepolia.id]: http(process.env.NEXT_PUBLIC_RPC_URL_BASE_SEPOLIA!),
    [sepolia.id]: http(process.env.NEXT_PUBLIC_RPC_URL_SEPOLIA!),
  },
});

// Chain ID mapping between SubWallet Connect and Wagmi
const chainIdMapping: { [key: string]: number } = {
  "0xaa36a7": sepolia.id, // Sepolia
  "0x14a34": baseSepolia.id, // Base Sepolia
};

function NetworkSynchronizer({ children }: { children: React.ReactNode }) {
  const [{ wallet }] = useConnectWallet();
  const [mounted, setMounted] = React.useState(false);

  // Use the wallet sync hook
  useWalletSync();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (wallet?.provider) {
      // Listen for chain changes
      wallet.provider.on("chainChanged", (chainId: string) => {
        if (chainIdMapping[chainId]) {
          console.log("Chain changed in SubWallet:", chainId);
        }
      });

      // Listen for account changes
      wallet.provider.on("accountsChanged", (accounts: string[]) => {
        if (!accounts || accounts.length === 0) {
          console.log("SubWallet disconnected");
        }
      });

      return () => {
        wallet.provider.removeListener("chainChanged", () => {});
        wallet.provider.removeListener("accountsChanged", () => {});
      };
    }
  }, [wallet]);

  if (!mounted) return null;
  return <>{children}</>;
}

export function WalletProviders({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {/* <RainbowKitProvider
          initialChain={0}
          showRecentTransactions={true}
          theme={darkTheme({
            accentColor: "#ff8800",
            accentColorForeground: "white",
            borderRadius: "small",
          })}
          locale="en-US"
        > */}
        <Web3OnboardProvider web3Onboard={web3Onboard}>
          <NetworkSynchronizer>{children}</NetworkSynchronizer>
        </Web3OnboardProvider>
        {/* </RainbowKitProvider> */}
      </QueryClientProvider>
    </WagmiProvider>
  );
}

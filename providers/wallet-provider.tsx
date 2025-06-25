"use client";

import * as React from "react";
import {
  RainbowKitProvider,
  getDefaultWallets,
  getDefaultConfig,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import { trustWallet, ledgerWallet } from "@rainbow-me/rainbowkit/wallets";
import { sepolia, baseSepolia } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, http } from "wagmi";

const { wallets } = getDefaultWallets();

const config = getDefaultConfig({
  appName: process.env.NEXT_PUBLIC_WALLET_APP_NAME!,
  projectId: process.env.NEXT_PUBLIC_WALLET_PROJECT_ID!,
  wallets: [
    ...wallets,
    {
      groupName: "Other",
      wallets: [trustWallet, ledgerWallet],
    },
  ],
  chains: [sepolia, baseSepolia],
  transports: {
    [sepolia.id]: http(process.env.NEXT_PUBLIC_RPC_URL_SEPOLIA!),
    [baseSepolia.id]: http(process.env.NEXT_PUBLIC_RPC_URL_BASE_SEPOLIA!),
  },
  ssr: true, // Because it is Nextjs's App router, you need to declare ssr as true
});

const queryClient = new QueryClient();

export function WalletProviders({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <WagmiProvider  config={config}>
      <QueryClientProvider  client={queryClient}>
        <RainbowKitProvider
          initialChain={0}
          showRecentTransactions={true}
          theme={darkTheme({
            accentColor: "#7856ff",
            accentColorForeground: "white",
            borderRadius: "none",
          })}
          locale="en-US"
        >
          {mounted && children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

"use client";

import * as React from "react";
import {
  RainbowKitProvider,
  getDefaultWallets,
  getDefaultConfig,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import { trustWallet, ledgerWallet } from "@rainbow-me/rainbowkit/wallets";
import { moonbaseAlpha, moonbeam, sepolia, baseSepolia } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, http } from "wagmi";
import { defineChain } from "viem";

const { wallets } = getDefaultWallets();

export const westendAssetHub = defineChain({
  id: 420420421,
  name: "Westend AssetHub",
  nativeCurrency: {
    decimals: 18,
    name: "Westend",
    symbol: "WND",
  },
  rpcUrls: {
    default: {
      http: ["https://westend-asset-hub-eth-rpc.polkadot.io"],
      webSocket: ["wss://westend-asset-hub-eth-rpc.polkadot.io"],
    },
  },
  blockExplorers: {
    default: { name: "Explorer", url: "https://assethub-westend.subscan.io" },
  },
  contracts: {
    multicall3: {
      address: "0x5545dec97cb957e83d3e6a1e82fabfacf9764cf1",
      blockCreated: 10174702,
    },
  },
});

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
  chains: [westendAssetHub, moonbeam, moonbaseAlpha, sepolia, baseSepolia],
  transports: {
    [westendAssetHub.id]: http(),
    [moonbeam.id]: http(),
    [moonbaseAlpha.id]: http(),
    [sepolia.id]: http(process.env.NEXT_PUBLIC_RPC_URL_SEPOLIA!),
    [baseSepolia.id]: http(process.env.NEXT_PUBLIC_RPC_URL_SEPOLIA!),
  },
  ssr: true,
});

const queryClient = new QueryClient();

export function WalletProviders({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
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

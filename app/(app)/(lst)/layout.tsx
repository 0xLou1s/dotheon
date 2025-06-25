"use client";

import ConnectWalletBtn from "@/components/connect-wallet-btn";
import { WalletProviders } from "@/providers/wallet-provider";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <WalletProviders>
      <div className="flex flex-col gap-4">
        <div className="w-full flex justify-end">
          <ConnectWalletBtn />
        </div>
        <div>{children}</div>
      </div>
    </WalletProviders>
  );
}

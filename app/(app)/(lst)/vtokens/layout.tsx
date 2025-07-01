"use client";

import ConnectWalletBtn from "@/components/connect-wallet-btn";
import UnavailableMobileScreen from "@/components/temp/unavailable-mobile-screen";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="w-full flex justify-end">
        <ConnectWalletBtn />
      </div>
      <div className="hidden md:block">{children}</div>
      <div className="block md:hidden">
        <UnavailableMobileScreen />
      </div>
    </div>
  );
}

"use client";

import MintComponent from "@/components/onchains/mint-component";
import { useBalance, useAccount, useReadContracts } from "wagmi";
import { erc20Abi, Address } from "viem";
import { TOKEN_LIST } from "@/lib/constants";
import BalancesComponent from "@/components/onchains/balances-component";
import ConnectWalletBtn from "@/components/connect-wallet-btn";
import { useState, useEffect, useRef } from "react";
import {
  OnboardingTour,
  StartTourButton,
  TourStep,
} from "@/components/ui/onboarding-tour";

export default function MintPage() {
  const { address, isConnected } = useAccount();
  const [showTour, setShowTour] = useState(false);
  const finalStepRef = useRef<HTMLDivElement>(null);

  const {
    data: nativeBalance,
    isLoading: isLoadingNativeBalance,
    refetch: refetchNativeBalance,
  } = useBalance({
    address: address,
  });

  const {
    data: tokenBalances,
    isLoading: isTokenBalancesLoading,
    refetch: refetchTokenBalances,
  } = useReadContracts({
    contracts: [
      // DOT
      {
        abi: erc20Abi,
        address: TOKEN_LIST.filter((token) => token.symbol === "DOT")[0]
          .address as Address,
        functionName: "balanceOf",
        args: [address as Address],
      },
      // vETH
      {
        abi: erc20Abi,
        address: TOKEN_LIST.filter((token) => token.symbol === "vETH")[0]
          .address as Address,
        functionName: "balanceOf",
        args: [address as Address],
      },
      // vDOT
      {
        abi: erc20Abi,
        address: TOKEN_LIST.filter((token) => token.symbol === "vDOT")[0]
          .address as Address,
        functionName: "balanceOf",
        args: [address as Address],
      },
    ],
  });

  // Define the tour steps
  const tourSteps: TourStep[] = [
    {
      element: "#wallet-connect-button",
      popover: {
        title: "Connect Your Wallet",
        description:
          "First, connect your wallet to access the minting features.",
        side: "bottom",
      },
    },
    {
      element: "#balance-section",
      popover: {
        title: "Your Balances",
        description:
          "Here you can see your current token balances and refresh them if needed.",
        side: "right",
      },
    },
    {
      element: "#mint-section",
      popover: {
        title: "Mint Liquid Tokens",
        description:
          "This is where you can mint vDOT and vETH tokens by selecting a token and amount.",
        side: "left",
      },
    },
    {
      element: "#token-selector",
      popover: {
        title: "Select Token",
        description: "Choose which token you want to mint (vETH or vDOT).",
        side: "bottom",
      },
    },
    {
      element: "#amount-controls",
      popover: {
        title: "Set Amount",
        description:
          "Enter the amount you want to mint or use the percentage buttons for quick selection.",
        side: "top",
      },
    },
    {
      element: "#mint-button",
      popover: {
        title: "Mint Tokens",
        description:
          "Click this button to initiate the minting process once you've selected a token and amount.",
        side: "top",
      },
    },
    {
      element: "#tour-finish",
      popover: {
        title: "You're All Set!",
        description:
          "You've completed the tour. Click the 'Done' button below to start using the app.",
        side: "top",
      },
    },
  ];

  // Auto-start the tour on first visit
  useEffect(() => {
    const hasSeenTour = localStorage.getItem("hasSeenMintTour");
    if (!hasSeenTour && isConnected) {
      setShowTour(true);
      localStorage.setItem("hasSeenMintTour", "true");
    }
  }, [isConnected]);

  const handleCloseTour = () => {
    setShowTour(false);
  };

  const handleStartTour = () => {
    setShowTour(true);
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Mint Liquid Tokens</h1>
        <StartTourButton onClick={handleStartTour} />
      </div>

      <div className="flex flex-col md:flex-row gap-4 w-full">
        <div id="balance-section" className="flex-1">
          <BalancesComponent
            nativeBalance={nativeBalance?.value ?? BigInt(0)}
            isNativeBalanceLoading={isLoadingNativeBalance}
            refetchNativeBalance={refetchNativeBalance}
            tokenBalances={
              tokenBalances?.map((token) => token.result ?? BigInt(0)) ?? []
            }
            isTokenBalancesLoading={isTokenBalancesLoading}
            refetchTokenBalances={refetchTokenBalances}
          />
        </div>

        <div id="mint-section" className="flex-1">
          <MintComponent
            nativeBalance={nativeBalance?.value ?? BigInt(0)}
            tokenBalances={
              tokenBalances?.map((balance) => balance.result) as
                | [bigint | undefined, bigint | undefined, bigint | undefined]
                | undefined
            }
          />
        </div>
      </div>

      <div
        id="tour-finish"
        ref={finalStepRef}
        className="fixed bottom-5 right-5 opacity-0 pointer-events-none"
      />

      <OnboardingTour
        steps={tourSteps}
        showTour={showTour}
        onClose={handleCloseTour}
      />
    </div>
  );
}

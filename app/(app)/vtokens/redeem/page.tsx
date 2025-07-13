"use client";

import { useBalance, useAccount, useContractRead } from "wagmi";
import { erc20Abi, Address } from "viem";
import { TOKEN_LIST } from "@/lib/constants";
import BalancesComponent from "@/components/onchains/balances-component";
import { useState, useEffect, useRef } from "react";
import {
  OnboardingTour,
  StartTourButton,
  TourStep,
} from "@/components/ui/onboarding-tour";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import RedeemComponent from "@/components/onchains/redeem-component";
import { useChainId } from "wagmi";

export default function RedeemPage() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const [showTour, setShowTour] = useState(false);
  const finalStepRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const tokenParam = searchParams.get("token");
  const [initialToken, setInitialToken] = useState<string | null>(null);

  const {
    data: nativeBalance,
    isLoading: isLoadingNativeBalance,
    refetch: refetchNativeBalance,
  } = useBalance({
    address: address,
    enabled: !!address,
    chainId: chainId,
  });

  const dotToken = TOKEN_LIST.find((token) => token.symbol === "DOT");
  const vethToken = TOKEN_LIST.find((token) => token.symbol === "vETH");
  const vdotToken = TOKEN_LIST.find((token) => token.symbol === "vDOT");

  // Individual contract reads for each token
  const {
    data: dotBalance,
    isLoading: isDotLoading,
    refetch: refetchDot,
  } = useContractRead({
    address: dotToken?.address as Address,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [address as Address],
    enabled: !!address && !!dotToken,
    chainId: chainId,
  });

  const {
    data: vethBalance,
    isLoading: isVethLoading,
    refetch: refetchVeth,
  } = useContractRead({
    address: vethToken?.address as Address,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [address as Address],
    enabled: !!address && !!vethToken,
    chainId: chainId,
  });

  const {
    data: vdotBalance,
    isLoading: isVdotLoading,
    refetch: refetchVdot,
  } = useContractRead({
    address: vdotToken?.address as Address,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [address as Address],
    enabled: !!address && !!vdotToken,
    chainId: chainId,
  });

  // Combine loading states
  const isTokenBalancesLoading = isDotLoading || isVethLoading || isVdotLoading;

  // Combine refetch functions
  const refetchTokenBalances = async () => {
    await Promise.all([refetchDot(), refetchVeth(), refetchVdot()]);
  };

  // Handle changes to the URL parameters
  useEffect(() => {
    if (tokenParam) {
      if (
        tokenParam.toLowerCase() === "dot" ||
        tokenParam.toLowerCase() === "vdot"
      ) {
        setInitialToken("vDOT");
      } else if (
        tokenParam.toLowerCase() === "eth" ||
        tokenParam.toLowerCase() === "veth"
      ) {
        setInitialToken("vETH");
      }
    }
  }, [tokenParam]);

  // This function will be called when a token is selected directly on this page
  const handleSelectToken = (symbol: string) => {
    setInitialToken(symbol);
    const params = new URLSearchParams(searchParams.toString());
    if (symbol === "vDOT") {
      params.set("token", "vDOT");
    } else if (symbol === "vETH") {
      params.set("token", "vETH");
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // Define the tour steps
  const tourSteps: TourStep[] = [
    {
      element: "#wallet-connect-button",
      popover: {
        title: "Connect Your Wallet",
        description:
          "First, connect your wallet to access the redemption features.",
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
      element: "#redeem-section",
      popover: {
        title: "Redeem Liquid Tokens",
        description:
          "This is where you can redeem vDOT and vETH tokens by selecting a token and amount.",
        side: "left",
      },
    },
    {
      element: "#token-selector",
      popover: {
        title: "Select Token",
        description: "Choose which token you want to redeem (vETH or vDOT).",
        side: "bottom",
      },
    },
    {
      element: "#amount-controls",
      popover: {
        title: "Set Amount",
        description:
          "Enter the amount you want to redeem or use the Max button for quick selection.",
        side: "top",
      },
    },
    {
      element: "#mint-button",
      popover: {
        title: "Redeem Tokens",
        description:
          "Click this button to initiate the redemption process once you've selected a token and amount.",
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
    const hasSeenTour = localStorage.getItem("hasSeenRedeemTour");
    if (!hasSeenTour && isConnected) {
      setShowTour(true);
      localStorage.setItem("hasSeenRedeemTour", "true");
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
        <h1 className="text-2xl font-bold">Redeem Liquid Tokens</h1>
        <StartTourButton onClick={handleStartTour} />
      </div>

      <div className="flex flex-col md:flex-row gap-4 w-full">
        <div id="balance-section" className="flex-1">
          <BalancesComponent
            nativeBalance={nativeBalance?.value}
            isNativeBalanceLoading={isLoadingNativeBalance}
            refetchNativeBalance={refetchNativeBalance}
            tokenBalances={
              [dotBalance, vethBalance, vdotBalance] as [bigint, bigint, bigint]
            }
            isTokenBalancesLoading={isTokenBalancesLoading}
            refetchTokenBalances={refetchTokenBalances}
          />
        </div>

        <div id="redeem-section" className="flex-1">
          <RedeemComponent
            nativeBalance={nativeBalance?.value}
            tokenBalances={
              [dotBalance, vethBalance, vdotBalance] as [bigint, bigint, bigint]
            }
            initialTokenSymbol={initialToken}
            onTokenChange={handleSelectToken}
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

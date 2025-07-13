"use client";

import MintComponent from "@/components/onchains/mint-component";
import { useBalance, useAccount, useContractRead } from "wagmi";
import { erc20Abi, Address } from "viem";
import { TOKEN_LIST } from "@/lib/constants";
import BalancesComponent from "@/components/onchains/balances-component";
import RewardCalculator from "@/components/onchains/reward-calculator";
import { useState, useEffect, useRef } from "react";
import {
  OnboardingTour,
  StartTourButton,
  TourStep,
} from "@/components/ui/onboarding-tour";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CalculatorIcon } from "lucide-react";
import { useChainId } from "wagmi";

export default function MintPage() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const [showTour, setShowTour] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
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
      element: "#reward-calculator-button",
      popover: {
        title: "Reward Calculator",
        description:
          "Use this calculator to estimate potential rewards from staking.",
        side: "left",
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
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            id="reward-calculator-button"
            onClick={() => setShowCalculator(true)}
            className="flex items-center gap-2"
          >
            <CalculatorIcon className="h-4 w-4" />
            Reward Calculator
          </Button>
          <StartTourButton onClick={handleStartTour} />
        </div>
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

        <div id="mint-section" className="flex-1">
          <MintComponent
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

      {/* Reward Calculator Modal */}
      <RewardCalculator
        isOpen={showCalculator}
        onClose={() => setShowCalculator(false)}
        initialTokenSymbol={initialToken || undefined}
      />

      <OnboardingTour
        steps={tourSteps}
        showTour={showTour}
        onClose={handleCloseTour}
      />
    </div>
  );
}

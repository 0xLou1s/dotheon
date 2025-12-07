import Image from "next/image";
import { useChainId } from "wagmi";
import { Skeleton } from "@/components/ui/skeleton";
import { formatEther } from "viem";
import { formatBalance } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import type { BalancesProps } from "@/types/shared";
import { useState, useEffect } from "react";
import { TokenIcon } from "@/components/ui/token-icon";

export default function BalancesComponent({
  nativeBalance,
  isNativeBalanceLoading,
  refetchNativeBalance,
  tokenBalances,
  isTokenBalancesLoading,
  refetchTokenBalances,
}: BalancesProps) {
  const chainId = useChainId();
  const [isRefetching, setIsRefetching] = useState(false);

  // Debug logging
  useEffect(() => {
    console.log("BalancesComponent - Native Balance:", nativeBalance);
    console.log("BalancesComponent - Token Balances:", tokenBalances);
  }, [nativeBalance, tokenBalances]);

  async function handleRefetchAllBalances() {
    try {
      setIsRefetching(true);
      await Promise.all([refetchNativeBalance?.(), refetchTokenBalances?.()]);
    } catch (error) {
      console.error("Error refreshing balances:", error);
    } finally {
      setIsRefetching(false);
    }
  }

  // Helper function to get network name
  const getNetworkName = (chainId: number) => {
    switch (chainId) {
      case 11155111:
        return "Sepolia";
      case 84532:
        return "Base Sepolia";
      default:
        return "Unknown Network";
    }
  };

  const networkName = getNetworkName(chainId);

  // Safely get token balances
  const safeTokenBalances = Array.isArray(tokenBalances) ? tokenBalances : [];

  return (
    <div className="flex flex-col gap-4 w-full p-4">
      <div className="flex flex-col gap-2">
        <div className="flex flex-row justify-between gap-2">
          <h1 className="text-2xl font-bold">Tokens</h1>
          <Button
            className="hover:cursor-pointer"
            variant="ghost"
            size="icon"
            onClick={handleRefetchAllBalances}
            disabled={
              isRefetching || isNativeBalanceLoading || isTokenBalancesLoading
            }
          >
            <RefreshCcw
              className={`w-4 h-4 ${isRefetching ? "animate-spin" : ""}`}
            />
          </Button>
        </div>
        <p className="text-muted-foreground">Current wallet balances</p>
      </div>
      <div className="flex flex-col gap-4">
        <TokenBalanceItem
          symbol="ETH"
          name="Ethereum"
          networkName={networkName}
          balance={nativeBalance}
          isLoading={isNativeBalanceLoading}
        />

        <TokenBalanceItem
          symbol="DOT"
          name="Polkadot"
          networkName={networkName}
          balance={safeTokenBalances[0]}
          isLoading={isTokenBalancesLoading}
        />

        <TokenBalanceItem
          symbol="vETH"
          name="Voucher ETH"
          networkName={networkName}
          balance={safeTokenBalances[1]}
          isLoading={isTokenBalancesLoading}
        />

        <TokenBalanceItem
          symbol="vDOT"
          name="Voucher DOT"
          networkName={networkName}
          balance={safeTokenBalances[2]}
          isLoading={isTokenBalancesLoading}
        />
      </div>
    </div>
  );
}

interface TokenBalanceItemProps {
  symbol: string;
  name: string;
  networkName: string;
  balance: bigint | undefined | null;
  isLoading: boolean;
}

function TokenBalanceItem({
  symbol,
  name,
  networkName,
  balance,
  isLoading,
}: TokenBalanceItemProps) {
  // Format balance with proper error handling
  const displayBalance = () => {
    if (!balance) return "0";
    try {
      const formatted = formatEther(balance);
      return (+formatted).toFixed(6);
    } catch (error) {
      console.error("Error formatting balance:", error);
      return "0";
    }
  };

  return (
    <div className="flex flex-row justify-between gap-2">
      <div className="flex flex-row gap-4 items-center justify-center">
        <TokenIcon symbol={symbol} size={24} />
        <div className="flex flex-col">
          <p className="text-lg font-semibold">{name}</p>
          <p className="text-sm text-muted-foreground">{networkName}</p>
        </div>
      </div>
      <div className="flex flex-col text-right">
        <div className="text-md">
          {isLoading ? <Skeleton className="w-12 h-4" /> : displayBalance()}
        </div>
        <p className="text-muted-foreground">{symbol}</p>
      </div>
    </div>
  );
}

import Image from "next/image";
import { useChainId } from "wagmi";
import { Skeleton } from "@/components/ui/skeleton";
import { formatEther } from "viem";
import { roundLongDecimals } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import type { BalancesProps } from "@/types/shared";
import { useState } from "react";
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

  async function handleRefetchAllBalances() {
    try {
      setIsRefetching(true);
      await Promise.all([refetchNativeBalance(), refetchTokenBalances()]);
    } catch (error) {
      console.error("Error refreshing balances:", error);
    } finally {
      setIsRefetching(false);
    }
  }

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
            disabled={isRefetching}
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
          networkName={chainId === 11155111 ? "Sepolia" : "Base Sepolia"}
          balance={nativeBalance as bigint}
          isLoading={isNativeBalanceLoading}
        />

        <TokenBalanceItem
          symbol="DOT"
          name="Polkadot"
          networkName={chainId === 11155111 ? "Sepolia" : "Base Sepolia"}
          balance={tokenBalances?.[0] as bigint}
          isLoading={isTokenBalancesLoading}
        />

        <TokenBalanceItem
          symbol="vETH"
          name="Voucher ETH"
          networkName={chainId === 11155111 ? "Sepolia" : "Base Sepolia"}
          balance={tokenBalances?.[1] as bigint}
          isLoading={isTokenBalancesLoading}
        />

        <TokenBalanceItem
          symbol="vDOT"
          name="Voucher DOT"
          networkName={chainId === 11155111 ? "Sepolia" : "Base Sepolia"}
          balance={tokenBalances?.[2] as bigint}
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
  balance: bigint;
  isLoading: boolean;
}

function TokenBalanceItem({
  symbol,
  name,
  networkName,
  balance,
  isLoading,
}: TokenBalanceItemProps) {
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
          {isLoading ? (
            <Skeleton className="w-12 h-4" />
          ) : (
            roundLongDecimals(formatEther(balance || BigInt(0)), 6)
          )}
        </div>
        <p className="text-muted-foreground">{symbol}</p>
      </div>
    </div>
  );
}

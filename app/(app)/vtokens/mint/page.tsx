"use client";

import MintComponent from "@/components/onchains/mint-component";
import { useBalance, useAccount, useReadContracts } from "wagmi";
import { erc20Abi, Address } from "viem";
import { TOKEN_LIST } from "@/lib/constants";
import BalancesComponent from "@/components/onchains/balances-component";
import ConnectWalletBtn from "@/components/connect-wallet-btn";

export default function MintPage() {
  const { address } = useAccount();

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

  return (
    <div className="flex flex-col md:flex-row gap-4 bg-amber-500 w-full">
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
      <MintComponent
        nativeBalance={nativeBalance?.value ?? BigInt(0)}
        tokenBalances={
          tokenBalances?.map((balance) => balance.result) as
            | [bigint | undefined, bigint | undefined, bigint | undefined]
            | undefined
        }
      />
    </div>
  );
}

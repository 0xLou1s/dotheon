"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { TokenIcon } from "@/components/ui/token-icon";
import { useBifrostData } from "@/hooks/use-bifrost-data";
import { useTokenPrices } from "@/hooks/use-token-prices";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { VSTAKING_AVAILABLE } from "@/lib/vstaking-available";

interface TokenRowData {
  symbol: string;
  price: number;
  tvl: number;
  apy: string;
  apyDetails: {
    base: string;
    reward: string;
    mev?: string;
    gas?: string;
    total?: string;
  };
}

export function TokenStatistics() {
  const {
    loading: loadingBifrost,
    error,
    getAllTokens,
    data: bifrostData,
  } = useBifrostData();
  const { loading: loadingPrices, getTokenPrice } = useTokenPrices();

  const processTokenData = (): TokenRowData[] => {
    if (!bifrostData) return [];

    return getAllTokens()
      .filter(({ data }) => data.tvl !== null && data.tvl !== undefined)
      .map(({ symbol, data }) => {
        const baseApy = data.apyBase || data.apy || "0";
        const rewardApy = data.apyReward || "0";
        const mevApy = data.mevApy || undefined;
        const gasApy = data.gasFeeApy || undefined;
        const totalApy =
          data.totalApy || (Number(baseApy) + Number(rewardApy)).toString();

        return {
          symbol,
          price: getTokenPrice(symbol),
          tvl: data.tvl,
          apy: totalApy,
          apyDetails: {
            base: baseApy,
            reward: rewardApy,
            ...(mevApy && { mev: mevApy }),
            ...(gasApy && { gas: gasApy }),
            total: totalApy,
          },
        };
      })
      .sort((a, b) => b.tvl - a.tvl);
  };

  const renderSkeleton = () => (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-6 w-20" />
        </div>
      </TableCell>
      <TableCell>
        <Skeleton className="h-6 w-24" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-6 w-32" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-6 w-20" />
      </TableCell>
      <TableCell className="text-right">
        <Skeleton className="h-8 w-8 rounded-md ml-auto" />
      </TableCell>
    </TableRow>
  );

  const tokens = processTokenData();

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
        <h2 className="text-xl font-semibold">vStaking Tokens</h2>
        <div className="w-full sm:w-64"></div>
      </div>
      <Card className="w-full">
        <CardHeader className="px-2 py-0 hidden lg:block">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground ml-auto">
              TVL
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 cursor-pointer" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Total Value Locked</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground ml-4">
              APY
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 cursor-pointer" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Annual Percentage Yield</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[150px] lg:w-[200px] pl-4">
                    Asset
                  </TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>TVL</TableHead>
                  <TableHead className="hidden md:table-cell">APY</TableHead>
                  <TableHead className="hidden md:table-cell text-right pr-2">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loadingBifrost || loadingPrices ? (
                  <>
                    {renderSkeleton()}
                    {renderSkeleton()}
                  </>
                ) : error ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center text-red-500 py-8"
                    >
                      {error}
                    </TableCell>
                  </TableRow>
                ) : tokens.length > 0 ? (
                  tokens.map((token) => (
                    <TableRow key={token.symbol}>
                      <TableCell className="pl-4">
                        <div className="flex items-center gap-2 font-medium">
                          <TokenIcon symbol={token.symbol} size={32} />
                          <div className="flex flex-col items-start">
                            <span className="text-sm font-bold truncate">
                              {token.symbol}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm">
                            {formatCurrency(token.price)}
                          </span>
                          <span className="text-xs text-muted-foreground md:hidden">
                            {Number(token.apy).toFixed(2)}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatCurrency(token.tvl)}
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm font-semibold text-green-600">
                        {Number(token.apy).toFixed(2)}%
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-right pr-2">
                        {VSTAKING_AVAILABLE[
                          token.symbol as keyof typeof VSTAKING_AVAILABLE
                        ] ? (
                          <Button size="sm" asChild>
                            <Link href={`/vtokens/mint?token=${token.symbol}`}>
                              Mint
                            </Link>
                          </Button>
                        ) : null}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center text-muted-foreground py-8"
                    >
                      No token data available.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

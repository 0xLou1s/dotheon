"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowDown,
  ArrowUp,
  BarChart3,
  LineChart,
  TrendingUp,
} from "lucide-react";

interface MarketOverviewProps {
  data: any;
}

export function MarketOverview({ data }: MarketOverviewProps) {
  const marketData = {
    totalTvl: data.marketMetrics.totalTvl,
    avgApy: data.marketMetrics.avgApy,
    protocolCount: data.marketMetrics.protocolCount,
    bifrostRank: data.bifrostProtocol
      ? data.protocols.findIndex(
          (p: { name: string }) => p.name === data.bifrostProtocol.name
        ) + 1
      : 0,
    bifrostTvl: data.bifrostProtocol?.tvl || 0,
    bifrostApy: data.bifrostProtocol?.apy || 0,
  };

  // Format numbers for display
  const formatCurrency = (value: number) => {
    if (value >= 1_000_000_000) {
      return `$${(value / 1_000_000_000).toFixed(2)}B`;
    } else if (value >= 1_000_000) {
      return `$${(value / 1_000_000).toFixed(2)}M`;
    } else if (value >= 1_000) {
      return `$${(value / 1_000).toFixed(2)}K`;
    } else {
      return `$${value.toFixed(2)}`;
    }
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Total Market TVL
          </CardTitle>
          <CardDescription>
            Total value locked across all LST protocols
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(marketData.totalTvl)}
          </div>
          <p className="text-xs text-muted-foreground">
            Across {marketData.protocolCount} liquid staking protocols
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Average Market APY
          </CardTitle>
          <CardDescription>
            Weighted average APY across all protocols
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatPercentage(marketData.avgApy)}
          </div>
          <p className="text-xs text-muted-foreground">
            Market-wide liquid staking yield
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <LineChart className="h-4 w-4" />
            Bifrost TVL
          </CardTitle>
          <CardDescription>
            Total value locked in Bifrost protocol
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(marketData.bifrostTvl)}
          </div>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            Rank #{marketData.bifrostRank} by TVL
            {marketData.bifrostRank <= 10 ? (
              <span className="text-green-600 flex items-center">
                <ArrowUp className="h-3 w-3" /> Top 10
              </span>
            ) : (
              <span className="text-yellow-600 flex items-center">
                <ArrowDown className="h-3 w-3" /> Outside Top 10
              </span>
            )}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Bifrost APY
          </CardTitle>
          <CardDescription>Current yield on Bifrost protocol</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatPercentage(marketData.bifrostApy)}
          </div>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            {marketData.bifrostApy > marketData.avgApy ? (
              <span className="text-green-600 flex items-center">
                <ArrowUp className="h-3 w-3" /> Above market average
              </span>
            ) : (
              <span className="text-yellow-600 flex items-center">
                <ArrowDown className="h-3 w-3" /> Below market average
              </span>
            )}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

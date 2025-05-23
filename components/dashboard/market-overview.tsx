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

  const cards = [
    {
      title: "Total Market TVL",
      description: "Total value locked across all LST protocols",
      value: formatCurrency(marketData.totalTvl),
      subtext: `Across ${marketData.protocolCount} liquid staking protocols`,
      icon: BarChart3,
    },
    {
      title: "Average Market APY",
      description: "Weighted average APY across all protocols",
      value: formatPercentage(marketData.avgApy),
      subtext: "Market-wide liquid staking yield",
      icon: TrendingUp,
    },
    {
      title: "Bifrost TVL",
      description: "Total value locked in Bifrost protocol",
      value: formatCurrency(marketData.bifrostTvl),
      subtext: (
        <span className="flex items-center gap-1">
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
        </span>
      ),
      icon: LineChart,
    },
    {
      title: "Bifrost APY",
      description: "Current yield on Bifrost protocol",
      value: formatPercentage(marketData.bifrostApy),
      subtext: (
        <span className="flex items-center gap-1">
          {marketData.bifrostApy > marketData.avgApy ? (
            <span className="text-green-600 flex items-center">
              <ArrowUp className="h-3 w-3" /> Above market average
            </span>
          ) : (
            <span className="text-yellow-600 flex items-center">
              <ArrowDown className="h-3 w-3" /> Below market average
            </span>
          )}
        </span>
      ),
      icon: TrendingUp,
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => (
        <Card key={index}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2 h-12">
              <card.icon className="hidden md:block h-4 w-4" />
              {card.title}
            </CardTitle>
            <CardDescription className="text-xs md:h-8">
              {card.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <p className="text-xs text-muted-foreground">{card.subtext}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

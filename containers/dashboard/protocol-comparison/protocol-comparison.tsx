"use client";

import { TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface Protocol {
  name: string;
  apy: number;
  tvl: number;
  pools: {
    apy: number;
    tvlUsd: number;
  }[];
}

interface ProtocolComparisonProps {
  data: {
    protocols: Protocol[];
  };
}

const CHART_COLORS = [
  "#ec4899", // pink-500
];

const formatProtocolName = (name: string) => {
  return name
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const formatCurrency = (value: number) => {
  if (value >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(2)}B`;
  } else if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(2)}M`;
  } else {
    return `$${(value / 1_000).toFixed(2)}K`;
  }
};

export default function ProtocolComparison({ data }: ProtocolComparisonProps) {
  const formatChartData = (
    data: { name: string; apy: number; tvl: number }[]
  ) => {
    return data.map((protocol) => ({
      name: protocol.name,
      apy: Number.parseFloat(protocol.apy.toFixed(2)),
      tvl: protocol.tvl,
    }));
  };

  // Get top 5 protocols by TVL and add Bifrost Liquid Staking
  const topProtocols = data.protocols
    .filter((protocol) => protocol.name !== "bifrost-liquid-staking")
    .slice(0, 5);

  const bifrostProtocol = data.protocols.find(
    (protocol) => protocol.name === "bifrost-liquid-staking"
  );

  const chartData = formatChartData([
    ...topProtocols,
    ...(bifrostProtocol ? [bifrostProtocol] : []),
  ]);

  const chartConfig = {
    apy: {
      label: "APY",
      color: CHART_COLORS[3],
    },
    label: {
      color: "oklch(var(--background))",
    },
  } satisfies ChartConfig;

  // Calculate average APY change
  const calculateApyChange = () => {
    if (chartData.length < 2) return 0;

    const sortedData = [...chartData].sort((a, b) => b.apy - a.apy);
    const highestApy = sortedData[0].apy;
    const secondHighestApy = sortedData[1].apy;

    if (secondHighestApy === 0) return 0;
    return ((highestApy - secondHighestApy) / secondHighestApy) * 100;
  };

  const apyChange = calculateApyChange();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Protocol APY Comparison</CardTitle>
        <CardDescription>
          Compare APY across top liquid staking protocols
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              right: 16,
            }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="name"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={formatProtocolName}
              hide
            />
            <XAxis dataKey="apy" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;

                const data = chartData.find((item) => item.name === label);
                if (!data) return null;

                return (
                  <div className="rounded-md border bg-background p-4 shadow-md">
                    <div className="text-sm font-medium">
                      {formatProtocolName(String(label))}
                    </div>
                    <div className="text-sm font-medium">
                      APY: {data.apy.toFixed(2)}%
                    </div>
                    <div className="text-xs text-muted-foreground">
                      TVL: {formatCurrency(data.tvl)}
                    </div>
                  </div>
                );
              }}
            />
            <Bar
              dataKey="apy"
              layout="vertical"
              fill={CHART_COLORS[0]}
              radius={4}
            >
              <LabelList
                dataKey="name"
                position="insideLeft"
                offset={8}
                className="fill-white"
                fontSize={12}
                formatter={formatProtocolName}
              />
              <LabelList
                dataKey="apy"
                position="right"
                offset={8}
                className="fill-white"
                fontSize={12}
                formatter={(value: number) => `${value.toFixed(2)}%`}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          {apyChange >= 0 ? "Leading by" : "Trailing by"}{" "}
          {Math.abs(apyChange).toFixed(1)}%{" "}
          <TrendingUp
            className={`h-4 w-4 ${apyChange < 0 ? "rotate-180" : ""}`}
          />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing average APY across all pools
        </div>
      </CardFooter>
    </Card>
  );
}

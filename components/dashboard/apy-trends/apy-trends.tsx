"use client";

import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

interface Protocol {
  name: string;
  pools: {
    history: {
      timestamp: string;
      apy: number;
      tvlUsd?: number;
    }[];
  }[];
}

interface ApyTrendsProps {
  data: {
    protocols: Protocol[];
  };
  showDetailed?: boolean;
}

const CHART_COLORS = [
  "#2563eb", // blue-600
  "#8b5cf6", // violet-500
  "#ec4899", // pink-500
  "#f97316", // orange-500
  "#10b981", // emerald-500
  "#f59e0b", // amber-500 - for Bifrost
];

const formatProtocolName = (name: string) => {
  return name
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const TIME_RANGES = [
  { label: "1 Month", value: "1M" },
  { label: "3 Months", value: "3M" },
  { label: "6 Months", value: "6M" },
  { label: "1 Year", value: "1Y" },
  { label: "All Time", value: "ALL" },
];

export function ApyTrends({ data, showDetailed = false }: ApyTrendsProps) {
  const [timeRange, setTimeRange] = useState("3M");

  // Get top 5 protocols by TVL and add Bifrost Liquid Staking
  const sortedProtocols = data.protocols
    .filter((protocol) => protocol.name !== "bifrost-liquid-staking")
    .sort((a, b) => {
      const aTvl = a.pools.reduce(
        (sum, pool) =>
          sum + (pool.history[pool.history.length - 1]?.tvlUsd || 0),
        0
      );
      const bTvl = b.pools.reduce(
        (sum, pool) =>
          sum + (pool.history[pool.history.length - 1]?.tvlUsd || 0),
        0
      );
      return bTvl - aTvl;
    });

  const topProtocols = sortedProtocols.slice(0, 5);

  const bifrostProtocol = data.protocols.find(
    (protocol) => protocol.name === "bifrost-liquid-staking"
  );

  const chartProtocols = [
    ...topProtocols,
    ...(bifrostProtocol ? [bifrostProtocol] : []),
  ];

  // Format data for the chart
  const formatChartData = () => {
    // Get all unique dates from all protocols
    const allDates = new Set<string>();

    // First, collect all unique dates from all protocols' history
    chartProtocols.forEach((protocol: Protocol) => {
      protocol.pools.forEach((pool) => {
        pool.history.forEach((point) => {
          if (point.timestamp) {
            // Format date to YYYY-MM-DD
            const date = point.timestamp.split("T")[0];
            allDates.add(date);
          }
        });
      });
    });

    // Sort dates chronologically
    const sortedDates = Array.from(allDates).sort();

    // Filter dates based on selected time range
    let filteredDates = sortedDates;
    if (timeRange !== "ALL") {
      const now = new Date();
      const cutoffDate = new Date();

      switch (timeRange) {
        case "1M":
          cutoffDate.setMonth(now.getMonth() - 1);
          break;
        case "3M":
          cutoffDate.setMonth(now.getMonth() - 3);
          break;
        case "6M":
          cutoffDate.setMonth(now.getMonth() - 6);
          break;
        case "1Y":
          cutoffDate.setFullYear(now.getFullYear() - 1);
          break;
      }

      filteredDates = sortedDates.filter(
        (date) => new Date(date) >= cutoffDate
      );
    }

    // Create a map of date -> protocol -> APY
    const dateProtocolMap: Record<string, Record<string, number>> = {};

    // Initialize the map with all dates
    filteredDates.forEach((date) => {
      dateProtocolMap[date] = { date: date as unknown as number };
    });

    // Fill in APY values for each protocol on each date
    chartProtocols.forEach((protocol: Protocol) => {
      // Aggregate APY by date for all pools of this protocol
      const protocolApyByDate: Record<
        string,
        { total: number; count: number }
      > = {};

      protocol.pools.forEach((pool) => {
        pool.history.forEach((point) => {
          if (point.timestamp) {
            const date = point.timestamp.split("T")[0];
            if (filteredDates.includes(date)) {
              if (!protocolApyByDate[date]) {
                protocolApyByDate[date] = { total: 0, count: 0 };
              }
              if (point.apy) {
                protocolApyByDate[date].total += point.apy;
                protocolApyByDate[date].count += 1;
              }
            }
          }
        });
      });

      // Calculate average APY for each date
      Object.entries(protocolApyByDate).forEach(([date, { total, count }]) => {
        if (dateProtocolMap[date] && count > 0) {
          dateProtocolMap[date][protocol.name] = total / count;
        }
      });
    });

    // Convert map to array for Recharts
    return filteredDates.map((date) => dateProtocolMap[date]);
  };

  const chartData = formatChartData();

  // Create chart config for shadcn/ui chart components
  const chartConfig = chartProtocols.reduce(
    (acc: ChartConfig, protocol: Protocol, index: number) => {
      acc[protocol.name] = {
        label: protocol.name
          .split("-")
          .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" "),
        color:
          protocol.name === "bifrost-liquid-staking"
            ? CHART_COLORS[5] // Use amber color for Bifrost
            : CHART_COLORS[index],
      };
      return acc;
    },
    {} as ChartConfig
  );

  // Calculate average APY change
  const calculateApyChange = () => {
    if (chartData.length < 2) return 0;

    const latestData = chartData[chartData.length - 1];
    const previousData = chartData[chartData.length - 2];

    let latestTotal = 0;
    let previousTotal = 0;
    let count = 0;

    chartProtocols.forEach((protocol) => {
      if (latestData[protocol.name] && previousData[protocol.name]) {
        latestTotal += latestData[protocol.name];
        previousTotal += previousData[protocol.name];
        count++;
      }
    });

    if (count === 0 || previousTotal === 0) return 0;
    return ((latestTotal - previousTotal) / previousTotal) * 100;
  };

  const apyChange = calculateApyChange();

  // Format date range for footer
  const formatDateRange = () => {
    if (chartData.length < 2) return "";
    const firstDate = new Date(chartData[0].date);
    const lastDate = new Date(chartData[chartData.length - 1].date);
    return `${firstDate.toLocaleDateString()} - ${lastDate.toLocaleDateString()}`;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>APY Trends</CardTitle>
            <CardDescription>
              Yield History - Top LST Protocols & Bifrost - Liquid Staking
            </CardDescription>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              {TIME_RANGES.map((range) => (
                <SelectItem key={range.value} value={range.value}>
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <defs>
              {chartProtocols.map((protocol, index) => (
                <linearGradient
                  key={`gradient-${protocol.name}`}
                  id={`fill-${protocol.name}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={CHART_COLORS[index]}
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor={CHART_COLORS[index]}
                    stopOpacity={0.1}
                  />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                if (!value) return "";
                const date = new Date(value);
                return `${date.getDate()}/${date.getMonth() + 1}`;
              }}
            />
            <ChartTooltip
              cursor={false}
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;

                return (
                  <div className="rounded-md border bg-background p-4 shadow-md">
                    <div className="text-sm font-medium mb-2">
                      {new Date(label).toLocaleDateString()}
                    </div>
                    {payload.map((entry, index) => {
                      const protocolName = String(entry.name ?? "");
                      const color = chartConfig[protocolName]?.color;
                      return (
                        <div
                          key={index}
                          className="flex items-center gap-2 mb-1"
                        >
                          <div
                            className="h-2 w-2 rounded-full"
                            style={{ backgroundColor: color }}
                          />
                          <div className="text-sm font-medium">
                            {formatProtocolName(protocolName)}
                          </div>
                          <div className="ml-auto text-sm">
                            {entry.value
                              ? `${Number(entry.value).toFixed(2)}%`
                              : null}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              }}
            />
            {chartProtocols.map((protocol, index) => (
              <Area
                key={protocol.name}
                dataKey={protocol.name}
                type="natural"
                fill={`url(#fill-${protocol.name})`}
                fillOpacity={0.4}
                stroke={CHART_COLORS[index]}
                stackId="a"
              />
            ))}
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              {apyChange >= 0 ? "Trending up" : "Trending down"} by{" "}
              {Math.abs(apyChange).toFixed(1)}% this month{" "}
              <TrendingUp
                className={`h-4 w-4 ${apyChange < 0 ? "rotate-180" : ""}`}
              />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              {formatDateRange()}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

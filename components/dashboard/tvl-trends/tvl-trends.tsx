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
      tvlUsd: number;
    }[];
  }[];
}

interface TvlTrendsProps {
  data: {
    protocols: Protocol[];
  };
  showDetailed?: boolean;
}

// Manual colors for the chart
const CHART_COLORS = [
  "#2563eb", // blue-600
  "#8b5cf6", // violet-500
  "#ec4899", // pink-500
  "#f97316", // orange-500
  "#10b981", // emerald-500
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

export function TvlTrends({ data, showDetailed = false }: TvlTrendsProps) {
  const [timeRange, setTimeRange] = useState("6M");

  // Get top 5 protocols by TVL for the chart
  const topProtocols = data.protocols.slice(0, 5);

  // Format data for the chart
  const formatChartData = () => {
    // Get all unique dates from all protocols
    const allDates = new Set<string>();

    // First, collect all unique dates from all protocols' history
    topProtocols.forEach((protocol: Protocol) => {
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

    // Create a map of date -> protocol -> TVL
    const dateProtocolMap: Record<string, Record<string, number>> = {};

    // Initialize the map with all dates
    filteredDates.forEach((date) => {
      dateProtocolMap[date] = { date: date as unknown as number };
    });

    // Fill in TVL values for each protocol on each date
    topProtocols.forEach((protocol: Protocol) => {
      // Aggregate TVL by date for all pools of this protocol
      const protocolTvlByDate: Record<string, number> = {};

      protocol.pools.forEach((pool) => {
        pool.history.forEach((point) => {
          if (point.timestamp) {
            const date = point.timestamp.split("T")[0];
            if (filteredDates.includes(date)) {
              if (!protocolTvlByDate[date]) {
                protocolTvlByDate[date] = 0;
              }
              protocolTvlByDate[date] += point.tvlUsd || 0;
            }
          }
        });
      });

      // Add protocol TVL to the date map
      Object.entries(protocolTvlByDate).forEach(([date, tvl]) => {
        if (dateProtocolMap[date]) {
          dateProtocolMap[date][protocol.name] = tvl;
        }
      });
    });

    // Convert map to array for Recharts
    return filteredDates.map((date) => dateProtocolMap[date]);
  };

  const chartData = formatChartData();

  // Create chart config for shadcn/ui chart components
  const chartConfig = topProtocols.reduce(
    (acc: ChartConfig, protocol: Protocol, index: number) => {
      acc[protocol.name] = {
        label: protocol.name
          .split("-")
          .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" "),
        color: CHART_COLORS[index],
      };
      return acc;
    },
    {} as ChartConfig
  );

  // Calculate total TVL change
  const calculateTvlChange = () => {
    if (chartData.length < 2) return 0;

    const latestData = chartData[chartData.length - 1];
    const previousData = chartData[chartData.length - 2];

    let latestTotal = 0;
    let previousTotal = 0;

    topProtocols.forEach((protocol) => {
      latestTotal += latestData[protocol.name] || 0;
      previousTotal += previousData[protocol.name] || 0;
    });

    if (previousTotal === 0) return 0;
    return ((latestTotal - previousTotal) / previousTotal) * 100;
  };

  const tvlChange = calculateTvlChange();

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
            <CardTitle>TVL Trends</CardTitle>
            <CardDescription>
              Historical total value locked for top 5 LST protocols
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
              {topProtocols.map((protocol, index) => (
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
                              ? Number(entry.value) >= 1e9
                                ? `$${(Number(entry.value) / 1e9).toFixed(2)}B`
                                : Number(entry.value) >= 1e6
                                ? `$${(Number(entry.value) / 1e6).toFixed(2)}M`
                                : `$${(Number(entry.value) / 1e3).toFixed(2)}K`
                              : null}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              }}
            />
            {topProtocols.map((protocol, index) => (
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
              {tvlChange >= 0 ? "Trending up" : "Trending down"} by{" "}
              {Math.abs(tvlChange).toFixed(1)}% this month{" "}
              <TrendingUp
                className={`h-4 w-4 ${tvlChange < 0 ? "rotate-180" : ""}`}
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

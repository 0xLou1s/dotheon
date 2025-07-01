"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ApyChartProps {
  tokenSymbol: string;
}

// Sample data - in a real app, this would come from an API
const generateSampleData = (tokenSymbol: string) => {
  const baseValue =
    tokenSymbol === "vDOT" ? 11 : tokenSymbol === "vETH" ? 3.2 : 5;
  const today = new Date();

  return Array.from({ length: 90 }, (_, i) => {
    const date = new Date();
    date.setDate(today.getDate() - (90 - i));

    // Create some random variations for the chart
    const randomFactor = Math.sin(i / 10) * 0.5 + Math.random() * 0.3 - 0.15;
    const baseApy = baseValue + randomFactor;
    const rewardApy = baseValue * 0.1 * (Math.random() * 0.5 + 0.75);

    return {
      date: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      totalApy: +(baseApy + rewardApy).toFixed(2),
      baseApy: +baseApy.toFixed(2),
      rewardApy: +rewardApy.toFixed(2),
      timestamp: date.getTime(),
    };
  });
};

export function ApyChart({ tokenSymbol }: ApyChartProps) {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("30d");
  const allData = generateSampleData(tokenSymbol);

  // Filter data based on selected time range
  const getFilteredData = () => {
    const now = Date.now();
    const ranges = {
      "7d": 7 * 24 * 60 * 60 * 1000,
      "30d": 30 * 24 * 60 * 60 * 1000,
      "90d": 90 * 24 * 60 * 60 * 1000,
    };

    return allData.filter((d) => now - d.timestamp < ranges[timeRange]);
  };

  const data = getFilteredData();

  const formatYAxis = (value: number) => `${value}%`;

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-end space-x-2 mb-4">
        <Button
          variant={timeRange === "7d" ? "default" : "outline"}
          size="sm"
          onClick={() => setTimeRange("7d")}
          className="h-8 text-xs"
        >
          7D
        </Button>
        <Button
          variant={timeRange === "30d" ? "default" : "outline"}
          size="sm"
          onClick={() => setTimeRange("30d")}
          className="h-8 text-xs"
        >
          30D
        </Button>
        <Button
          variant={timeRange === "90d" ? "default" : "outline"}
          size="sm"
          onClick={() => setTimeRange("90d")}
          className="h-8 text-xs"
        >
          90D
        </Button>
      </div>

      <div className="flex-1 w-full">
        <ResponsiveContainer width="100%" height="100%" minHeight={300}>
          <AreaChart
            data={data}
            margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
          >
            <defs>
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="colorBase" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="colorReward" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ffc658" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#ffc658" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              tickMargin={10}
              tickFormatter={(value, index) => {
                // Show fewer ticks on smaller screens
                const interval =
                  timeRange === "7d" ? 1 : timeRange === "30d" ? 5 : 15;
                return index % interval === 0 ? value : "";
              }}
            />
            <YAxis
              tickFormatter={formatYAxis}
              tick={{ fontSize: 12 }}
              tickMargin={10}
              domain={["dataMin - 0.5", "dataMax + 0.5"]}
            />
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <Tooltip
              formatter={(value: number) => [`${value}%`, ""]}
              labelFormatter={(label) => `Date: ${label}`}
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                border: "1px solid #ccc",
                borderRadius: "4px",
                padding: "10px",
              }}
            />
            <Legend verticalAlign="top" height={36} />
            <Area
              type="monotone"
              dataKey="totalApy"
              name="Total APY"
              stroke="#8884d8"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorTotal)"
              activeDot={{ r: 6 }}
            />
            <Area
              type="monotone"
              dataKey="baseApy"
              name="Base APY"
              stroke="#82ca9d"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorBase)"
            />
            <Area
              type="monotone"
              dataKey="rewardApy"
              name="Reward APY"
              stroke="#ffc658"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorReward)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

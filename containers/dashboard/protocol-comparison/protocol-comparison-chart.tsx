"use client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { Protocol } from "@/lib/lst-api";

interface ProtocolComparisonChartProps {
  data: Protocol[];
}

export default function ProtocolComparisonChart({
  data,
}: ProtocolComparisonChartProps) {
  // Get top 10 protocols by TVL
  const topProtocols = data.slice(0, 10);

  // Format data for the chart
  const chartData = topProtocols.map((protocol) => ({
    name: protocol.name.replace("-liquid-staking", "").replace("-", " "),
    apy: Number.parseFloat(protocol.apy.toFixed(2)),
    tvl: protocol.tvl,
    isBifrost: protocol.name.toLowerCase().includes("bifrost"),
  }));

  // Format protocol name for display
  const formatProtocolName = (name: string) => {
    // Capitalize first letter of each word
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Format currency for display
  const formatCurrency = (value: number) => {
    if (value >= 1_000_000_000) {
      return `$${(value / 1_000_000_000).toFixed(2)}B`;
    } else if (value >= 1_000_000) {
      return `$${(value / 1_000_000).toFixed(2)}M`;
    } else {
      return `$${(value / 1_000).toFixed(2)}K`;
    }
  };

  return (
    <div className="w-full h-[500px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
        >
          <XAxis type="number" tickFormatter={(value) => `${value}%`} />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fontSize: 12 }}
            tickFormatter={formatProtocolName}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (!active || !payload?.[0]) return null;

              const protocol = payload[0].payload;

              return (
                <div className="rounded-md border bg-background p-4 shadow-md">
                  <div className="text-sm font-medium">
                    {formatProtocolName(protocol.name)}
                  </div>
                  <div className="text-sm font-medium">
                    APY: {protocol.apy.toFixed(2)}%
                  </div>
                  <div className="text-xs text-muted-foreground">
                    TVL: {formatCurrency(protocol.tvl)}
                  </div>
                </div>
              );
            }}
          />
          <Bar
            dataKey="apy"
            fill="#0891b2" // cyan-600 (primary color)
            radius={[0, 4, 4, 0]}
            fillOpacity={0.7}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

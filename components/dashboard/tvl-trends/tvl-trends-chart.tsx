"use client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { Protocol } from "@/lib/lst-api";

interface TvlTrendsChartProps {
  data: Protocol[];
  showDetailed?: boolean;
}

export default function TvlTrendsChart({ data }: TvlTrendsChartProps) {
  // Format data for the chart
  const formatChartData = () => {
    // Get all unique dates from all protocols
    const allDates = new Set<string>();

    // First, collect all unique dates from all protocols' history
    data.forEach((protocol) => {
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

    // Create a map of date -> protocol -> TVL
    const dateProtocolMap: Record<string, Record<string, number>> = {};

    // Initialize the map with all dates
    sortedDates.forEach((date) => {
      dateProtocolMap[date] = { date: date as unknown as number };
    });

    // Fill in TVL values for each protocol on each date
    data.forEach((protocol) => {
      // Aggregate TVL by date for all pools of this protocol
      const protocolTvlByDate: Record<string, number> = {};

      protocol.pools.forEach((pool) => {
        pool.history.forEach((point) => {
          if (point.timestamp) {
            const date = point.timestamp.split("T")[0];
            if (!protocolTvlByDate[date]) {
              protocolTvlByDate[date] = 0;
            }
            protocolTvlByDate[date] += point.tvlUsd || 0;
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
    return sortedDates.map((date) => dateProtocolMap[date]);
  };

  const chartData = formatChartData();

  // Format TVL for y-axis
  const formatYAxis = (value: number) => {
    if (value >= 1e9) {
      return `$${(value / 1e9).toFixed(1)}B`;
    } else if (value >= 1e6) {
      return `$${(value / 1e6).toFixed(1)}M`;
    } else {
      return `$${value.toFixed(0)}`;
    }
  };

  // Generate colors for each protocol
  const getProtocolColor = (index: number) => {
    const colors = [
      "#2563eb", // blue-600
      "#8b5cf6", // violet-500
      "#ec4899", // pink-500
      "#f97316", // orange-500
      "#10b981", // emerald-500
    ];

    return colors[index % colors.length];
  };

  // Format protocol name for display
  const formatProtocolName = (name: string) => {
    // Capitalize first letter of each word and replace hyphens with spaces
    return name
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Check if we have valid chart data
  const hasValidData =
    chartData.length > 0 &&
    data.some((protocol) =>
      chartData.some((point) => point[protocol.name] !== undefined)
    );

  if (!hasValidData) {
    return (
      <div className="w-full h-[350px] flex items-center justify-center text-muted-foreground">
        No historical data available
      </div>
    );
  }

  return (
    <div className="w-full h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis
            dataKey="date"
            tickFormatter={(value) => {
              if (!value) return "";
              const date = new Date(value);
              return `${date.getDate()}/${date.getMonth() + 1}`;
            }}
          />
          <YAxis tickFormatter={formatYAxis} />
          <Tooltip
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null;

              return (
                <div className="rounded-md border bg-background p-4 shadow-md">
                  <div className="text-sm font-medium mb-2">
                    {new Date(label).toLocaleDateString()}
                  </div>
                  {payload.map((entry, index) => (
                    <div key={index} className="flex items-center gap-2 mb-1">
                      <div
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: entry.stroke }}
                      />
                      <div className="text-sm font-medium">
                        {formatProtocolName(String(entry.name ?? ""))}
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
                  ))}
                </div>
              );
            }}
          />
          {data.map((protocol, index) => (
            <Line
              key={protocol.name}
              type="monotone"
              dataKey={protocol.name}
              name={protocol.name}
              stroke={getProtocolColor(index)}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
              connectNulls={true}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

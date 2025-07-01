"use client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { Protocol } from "@/lib/lst-api";

interface HistoricalPerformanceChartProps {
  data: any[];
  protocols: Protocol[];
}

export default function HistoricalPerformanceChart({
  data,
  protocols,
}: HistoricalPerformanceChartProps) {
  // Generate colors for each protocol
  const getProtocolColor = (index: number, isBifrost: boolean) => {
    const colors = [
      "#2563eb", // blue-600
      "#8b5cf6", // violet-500
      "#ec4899", // pink-500
      "#f97316", // orange-500
      "#10b981", // emerald-500
      "#06b6d4", // cyan-500
      "#eab308", // yellow-500
      "#ef4444", // red-500
    ];

    // Use primary color for Bifrost
    if (isBifrost) {
      return "#0891b2"; // cyan-600 (primary color)
    }

    return colors[index % colors.length];
  };

  // Format protocol name for display
  const formatProtocolName = (name: string) => {
    // Capitalize first letter of each word and replace hyphens with spaces
    return name
      .replace("-liquid-staking", "")
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="w-full h-[500px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
        >
          <XAxis
            dataKey="date"
            angle={-45}
            textAnchor="end"
            height={60}
            tick={{ fontSize: 12 }}
          />
          <YAxis
            tickFormatter={(value) => `${value}%`}
            domain={["auto", "auto"]}
            tick={{ fontSize: 12 }}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (!active || !payload || payload.length === 0) return null;

              return (
                <div className="rounded-md border bg-background p-4 shadow-md">
                  <div className="text-sm font-medium mb-2">Date: {label}</div>
                  {payload.map((entry, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-sm"
                      style={{ color: entry.color }}
                    >
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: entry.color }}
                      />
                      <div className="truncate">
                        {formatProtocolName(entry.dataKey as string)}:
                      </div>
                      <div className="font-medium">
                        {entry.value !== undefined
                          ? `${Number(entry.value).toFixed(2)}%`
                          : "N/A"}
                      </div>
                    </div>
                  ))}
                </div>
              );
            }}
          />
          {protocols.map((protocol, index) => (
            <Line
              key={protocol.name}
              type="monotone"
              dataKey={protocol.name}
              name={formatProtocolName(protocol.name)}
              stroke={getProtocolColor(
                index,
                protocol.name.toLowerCase().includes("bifrost")
              )}
              strokeWidth={
                protocol.name.toLowerCase().includes("bifrost") ? 3 : 2
              }
              dot={false}
              activeDot={{ r: 5 }}
            />
          ))}
          <Legend
            formatter={(value) => formatProtocolName(value)}
            iconType="circle"
            iconSize={10}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

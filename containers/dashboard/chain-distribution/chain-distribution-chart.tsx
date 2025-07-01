"use client";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

interface ChainDistributionChartProps {
  data: any[];
  title: string;
}

export default function ChainDistributionChart({
  data,
  title,
}: ChainDistributionChartProps) {
  // Generate colors for each chain
  const getChainColor = (index: number) => {
    const colors = [
      "#2563eb", // blue-600
      "#8b5cf6", // violet-500
      "#ec4899", // pink-500
      "#f97316", // orange-500
      "#10b981", // emerald-500
      "#06b6d4", // cyan-500
      "#eab308", // yellow-500
      "#ef4444", // red-500
      "#6366f1", // indigo-500
      "#14b8a6", // teal-500
    ];

    return colors[index % colors.length];
  };

  // Calculate total TVL
  const totalTVL = data.reduce((sum, item) => sum + item.tvl, 0);

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
    <div className="w-full h-full flex flex-col">
      <h3 className="text-lg font-medium mb-2 text-center">{title}</h3>
      <div className="h-[250px] min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="tvl"
              nameKey="chain"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              cornerRadius={4}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getChainColor(index)} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.[0]) return null;

                const data = payload[0].payload;
                const percentage = (data.tvl / totalTVL) * 100;

                return (
                  <div className="rounded-md border bg-background p-4 shadow-md">
                    <div className="text-sm font-medium">{data.chain}</div>
                    <div className="text-xs text-muted-foreground">
                      {formatCurrency(data.tvl)}
                    </div>
                    <div className="font-medium">{percentage.toFixed(2)}%</div>
                  </div>
                );
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 flex-1 overflow-y-auto">
        <div className="grid grid-cols-2 gap-2 text-sm">
          {data.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="h-3 w-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: getChainColor(index) }}
              />
              <div className="truncate">{item.chain}</div>
              <div className="ml-auto font-medium whitespace-nowrap">
                {((item.tvl / totalTVL) * 100).toFixed(1)}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";

import { FolderUp, TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

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
import { Button } from "@/components/ui/button";

export const description = "A multiple line chart";

const chartData = [
  { month: "January", received: 186, send: 80, withdraw: 100 },
  { month: "February", received: 305, send: 200, withdraw: 100 },
  { month: "March", received: 237, send: 120, withdraw: 80 },
  { month: "April", received: 73, send: 190, withdraw: 10 },
  { month: "May", received: 209, send: 130, withdraw: 90 },
  { month: "June", received: 214, send: 140, withdraw: 120 },
];

const walletStats = [
  {
    label: "Total Received",
    value: "2.010550 ETH",
    color: "var(--chart-1)",
  },
  {
    label: "Total Send",
    value: "1.201055 ETH",
    color: "var(--chart-2)",
  },
  {
    label: "Total Withdraw",
    value: "5.410550 ETH",
    color: "var(--chart-3)",
  },
];

const chartConfig = {
  received: {
    label: "Received",
    color: "var(--chart-1)",
  },
  send: {
    label: "Send",
    color: "var(--chart-2)",
  },
  withdraw: {
    label: "Withdraw",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

export default function BalanceSummary() {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Balance Summary</CardTitle>
          <Button variant="outline">
            <FolderUp className="size-4" />
            Export
          </Button>
        </div>

        <div className="flex flex-col gap-4 lg:flex-row">
          {walletStats.map((stat, index) => (
            <Card key={index} className="p-4 bg-accent lg:w-1/4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center">
                  <div
                    className="size-2 rounded-full"
                    style={{ backgroundColor: stat.color }}
                  ></div>
                  <span className="text-muted-foreground text-sm ml-2">
                    {stat.label}
                  </span>
                </div>
                <p className="text-xl font-semibold">{stat.value}</p>
              </div>
            </Card>
          ))}
        </div>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey="received"
              type="monotone"
              stroke="var(--chart-1)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="send"
              type="monotone"
              stroke="var(--chart-2)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="withdraw"
              type="monotone"
              stroke="var(--chart-3)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>

      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 leading-none font-medium">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="text-muted-foreground flex items-center gap-2 leading-none">
              Showing total visitors for the last 6 months
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

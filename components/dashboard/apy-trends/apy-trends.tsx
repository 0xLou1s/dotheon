"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ApyTrendsChart from "./apy-trends-chart";
import { TrendingUp } from "lucide-react";

interface ApyTrendsProps {
  data: any;
  showDetailed?: boolean;
}

export function ApyTrends({ data, showDetailed = false }: ApyTrendsProps) {
  // Get top 5 protocols by TVL for the chart
  const topProtocols = data.protocols.slice(0, 5);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          APY Trends
        </CardTitle>
        <CardDescription>
          Historical yield performance across top LST protocols
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ApyTrendsChart data={topProtocols} />
      </CardContent>
    </Card>
  );
}

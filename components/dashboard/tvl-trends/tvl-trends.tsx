"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import TvlTrendsChart from "./tvl-trends-chart";
import { LineChart } from "lucide-react";

interface TvlTrendsProps {
  data: any;
  showDetailed?: boolean;
}

export function TvlTrends({ data, showDetailed = false }: TvlTrendsProps) {
  // Get top 5 protocols by TVL for the chart
  const topProtocols = data.protocols.slice(0, 5);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <LineChart className="h-5 w-5 text-primary" />
          TVL Trends
        </CardTitle>
        <CardDescription>
          Historical total value locked for top 5 LST protocols
        </CardDescription>
      </CardHeader>
      <CardContent>
        <TvlTrendsChart data={topProtocols} />
      </CardContent>
    </Card>
  );
}

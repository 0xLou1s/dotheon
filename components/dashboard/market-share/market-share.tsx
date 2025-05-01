"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import MarketSharePieChart from "./market-share-pie-chart";

interface MarketShareProps {
  data: any;
}

export function MarketShare({ data }: MarketShareProps) {
  // Find Bifrost protocol
  const bifrostProtocol = data.bifrostProtocol;
  const bifrostShare = bifrostProtocol
    ? ((bifrostProtocol.tvl / data.marketMetrics.totalTvl) * 100).toFixed(2)
    : "0.00";

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle>Market Share</CardTitle>
        <CardDescription>
          TVL distribution across protocols. Bifrost has {bifrostShare}% market
          share.
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[calc(100%-80px)]">
        <MarketSharePieChart data={data.protocols} />
      </CardContent>
    </Card>
  );
}

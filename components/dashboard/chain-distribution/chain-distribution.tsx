"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ChainDistributionChart from "./chain-distribution-chart";

interface ChainDistributionProps {
  data: any;
}

export function ChainDistribution({ data }: ChainDistributionProps) {
  // Get Bifrost pools chain distribution
  const bifrostPools = data.pools.filter((pool: { name: string }) =>
    pool.name.toLowerCase().includes("bifrost")
  );

  const bifrostChainMap = new Map<string, number>();
  bifrostPools.forEach((pool: { chain: string; tvl: number }) => {
    const chain = pool.chain;
    const currentTvl = bifrostChainMap.get(chain) || 0;
    bifrostChainMap.set(chain, currentTvl + pool.tvl);
  });

  const bifrostChainData = Array.from(bifrostChainMap.entries())
    .map(([chain, tvl]) => ({ chain, tvl }))
    .sort((a, b) => b.tvl - a.tvl);

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle>Chain Distribution</CardTitle>
        <CardDescription>
          TVL distribution across blockchain networks
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[calc(100%-80px)]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
          <div className="h-full">
            <ChainDistributionChart
              data={data.chainDistribution}
              title="Market-wide Distribution"
            />
          </div>
          <div className="h-full">
            {bifrostChainData.length > 0 ? (
              <ChainDistributionChart
                data={bifrostChainData}
                title="Bifrost Distribution"
              />
            ) : (
              <div className="flex items-center justify-center h-full border rounded-md">
                <p className="text-muted-foreground">
                  No Bifrost chain data available
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

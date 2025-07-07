"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchLSTData, HistoricalDataPoint, Protocol } from "@/lib/lst-api";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { MarketOverview } from "@/containers/dashboard/market-overview";
import { TvlTrends } from "@/containers/dashboard/tvl-trends/tvl-trends";
import { ApyTrends } from "@/containers/dashboard/apy-trends/apy-trends";
import ProtocolsTable from "@/containers/dashboard/protocols-table";
import { MarketShare } from "@/containers/dashboard/market-share/market-share";
import { HistoricalPerformance } from "@/containers/dashboard/historical-performance/historical-performance";
import { ChainDistribution } from "@/containers/dashboard/chain-distribution/chain-distribution";
import ProtocolComparison from "@/containers/dashboard/protocol-comparison/protocol-comparison";
import { TokenStatistics } from "@/containers/dashboard/token-statistics/token-statistics";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    // Load active tab from localStorage on mount
    const savedTab = localStorage.getItem("dashboardActiveTab");
    if (savedTab) {
      setActiveTab(savedTab);
    }
  }, []);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const data = await fetchLSTData();

        // Process data for all components
        const processedData = {
          protocols: data.protocols,
          pools: data.pools,

          // Calculate market metrics
          marketMetrics: {
            totalTvl: data.protocols.reduce(
              (sum, protocol) => sum + protocol.tvl,
              0
            ),
            avgApy: data.protocols.reduce(
              (sum, protocol) =>
                sum +
                protocol.apy *
                  (protocol.tvl /
                    data.protocols.reduce((s, p) => s + p.tvl, 0)),
              0
            ),
            protocolCount: data.protocols.length,
          },

          // Find Bifrost protocol data
          bifrostProtocol: data.protocols.find((p) =>
            p.name.toLowerCase().includes("bifrost")
          ),

          // Get top protocols
          topProtocols: data.protocols.slice(0, 5),

          // Process historical data
          historicalData: processHistoricalData(data),

          // Process chain distribution data
          chainDistribution: processChainDistribution(data),
        };

        setDashboardData(processedData);
        setError(null);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Helper function to process historical data
  function processHistoricalData(data: {
    protocols: any;
    pools?: {
      name: string;
      chain: string;
      symbol: string;
      tvl: number;
      apy: number;
      change_24h: number;
      change_7d: number;
      history: HistoricalDataPoint[];
      pool: string;
      poolMeta: string | null;
    }[];
  }) {
    // Find protocol with most historical data
    const protocolWithHistory = data.protocols.find(
      (p: { pools: { history: string | any[] }[] }) =>
        p.pools.length > 0 &&
        p.pools.some(
          (pool: { history: string | any[] }) =>
            pool.history && pool.history.length > 0
        )
    );

    if (!protocolWithHistory) return [];

    // Get the pool with most history
    const poolWithMostHistory = protocolWithHistory.pools.reduce(
      (
        prev: { history: string | any[] },
        current: { history: string | any[] }
      ) =>
        prev.history?.length > (current.history?.length || 0) ? prev : current,
      protocolWithHistory.pools[0]
    );

    if (!poolWithMostHistory.history) return [];

    // Format historical data
    return poolWithMostHistory.history
      .map(
        (point: {
          timestamp: string | number | Date;
          apy: number;
          apyBase: any;
          apyReward: any;
          tvlUsd: number;
        }) => ({
          date: new Date(point.timestamp).toLocaleDateString(),
          apy: Number.parseFloat(point.apy.toFixed(2)),
          apyBase: point.apyBase || 0,
          apyReward: point.apyReward || 0,
          tvl: point.tvlUsd / 1000000, // Convert to millions
        })
      )
      .slice(-30); // Last 30 data points
  }

  // Helper function to process chain distribution data
  function processChainDistribution(data: {
    protocols?: Protocol[];
    pools: any;
  }) {
    // Group all pools by chain
    const chainMap = new Map();
    data.pools.forEach((pool: { chain: string; tvl: number }) => {
      const chain = pool.chain;
      const currentTvl = chainMap.get(chain) || 0;
      chainMap.set(chain, currentTvl + pool.tvl);
    });

    // Convert to array and sort by TVL
    const chainArray = Array.from(chainMap.entries())
      .map(([chain, tvl]) => ({ chain, tvl }))
      .sort((a, b) => b.tvl - a.tvl);

    // Take top 9 chains and group the rest as "Others"
    const topChains = chainArray.slice(0, 9);
    const otherChains = chainArray.slice(9);
    const otherTvl = otherChains.reduce((sum, item) => sum + item.tvl, 0);

    if (otherTvl > 0) {
      topChains.push({ chain: "Others", tvl: otherTvl });
    }

    return topChains;
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    localStorage.setItem("dashboardActiveTab", value);
  };

  if (loading) {
    return (
      <div className="flex flex-col">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Liquid Staking Market Dashboard
            </h1>
            <p className="text-muted-foreground">
              Comprehensive data on liquid staking protocols
            </p>
          </div>
          <div className="text-sm text-muted-foreground">
            Data provided by <span className="font-medium">DefiLlama</span>
          </div>
        </div>
        <div className="flex-1 space-y-6 p-6">
          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="space-y-6"
          >
            <TabsList>
              <TabsTrigger value="overview">Market Overview</TabsTrigger>
              <TabsTrigger value="protocols">Protocols</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-[140px] w-full" />
                ))}
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                <Skeleton className="h-[300px] w-full" />
                <Skeleton className="h-[300px] w-full" />
              </div>
              <Skeleton className="h-[400px] w-full" />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col w-full">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Liquid Staking Market Dashboard
            </h1>
            <p className="text-muted-foreground">
              Comprehensive data on liquid staking protocols
            </p>
          </div>
        </div>
        <div className="flex-1 p-6">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-col lg:flex-row text-left lg:text-left lg:items-center justify-between border-b px-6 py-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Liquid Staking Market Dashboard
          </h1>
          <p className="text-muted-foreground">
            Comprehensive data on liquid staking protocols
          </p>
        </div>
        <div className="text-sm text-muted-foreground pt-4 lg:pt-0">
          Data provided by <span className="font-medium">DefiLlama</span>
        </div>
      </div>
      <div className="flex-1 space-y-6 p-6">
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="space-y-6"
        >
          <TabsList>
            <TabsTrigger value="overview">Market Overview</TabsTrigger>
            <TabsTrigger value="protocols">Protocols</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-6">
            <MarketOverview data={dashboardData} />

            <div className="grid gap-6 md:grid-cols-2">
              <TvlTrends data={dashboardData} />
              <ApyTrends data={dashboardData} />
            </div>
            <div className="overflow-x-auto w-full">
              <ProtocolsTable data={dashboardData} />
            </div>
            <div className="overflow-x-auto w-full">
              <TokenStatistics />
            </div>
          </TabsContent>
          <TabsContent value="protocols" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <ProtocolComparison data={dashboardData} />
              <MarketShare data={dashboardData} />
            </div>
            <ChainDistribution data={dashboardData} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import HistoricalPerformanceChart from "./historical-performance-chart";

interface HistoricalPerformanceProps {
  data: any;
}

export function HistoricalPerformance({ data }: HistoricalPerformanceProps) {
  const [chartType, setChartType] = useState<"line" | "area">("line");

  // Get the historical performance data from the parent component
  const [performanceData, setPerformanceData] = useState<any[]>([]);

  // Process historical data for comparison if not already done
  if (performanceData.length === 0 && data.historicalData.length > 0) {
    // This is a simplified approach - in a real app, you'd want to process this data more thoroughly
    setPerformanceData(data.historicalData);
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Historical Performance Comparison</CardTitle>
        <CardDescription>
          Compare APY performance across top liquid staking protocols
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs
          defaultValue="line"
          className="space-y-4"
          onValueChange={(value) => setChartType(value as "line" | "area")}
        >
          <TabsList>
            <TabsTrigger value="line">Line Chart</TabsTrigger>
            <TabsTrigger value="area">Area Chart</TabsTrigger>
          </TabsList>
          <TabsContent value="line" className="pt-4">
            <HistoricalPerformanceChart
              data={performanceData}
              protocols={data.topProtocols}
            />
          </TabsContent>
          <TabsContent value="area" className="pt-4">
            <HistoricalPerformanceChart
              data={performanceData}
              protocols={data.topProtocols}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

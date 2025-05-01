"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ProtocolComparisonChart from "./protocol-comparison-chart";

interface ProtocolComparisonProps {
  data: any;
}

export default function ProtocolComparison({ data }: ProtocolComparisonProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Protocol APY Comparison</CardTitle>
        <CardDescription>
          Compare APY across top liquid staking protocols
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ProtocolComparisonChart data={data.protocols} />
      </CardContent>
    </Card>
  );
}

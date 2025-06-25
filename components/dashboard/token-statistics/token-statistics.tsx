"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Info, ChevronRight } from "lucide-react";
import { TokenIcon } from "@/components/ui/token-icon";
import { useTokenData } from "@/hooks/use-token-data";
import type { ProcessedTokenData } from "@/hooks/use-token-data";
import { ApyAnalysisDialog } from "./apy-analysis-dialog";

export function TokenStatistics() {
  const { data, loading, error } = useTokenData();
  const [selectedToken, setSelectedToken] = useState<ProcessedTokenData | null>(
    null
  );
  const [isAnalysisDialogOpen, setIsAnalysisDialogOpen] = useState(false);

  const handleOpenAnalysis = (token: ProcessedTokenData) => {
    setSelectedToken(token);
    setIsAnalysisDialogOpen(true);
  };

  const renderSkeleton = () => (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-6 w-20" />
        </div>
      </TableCell>
      <TableCell>
        <Skeleton className="h-6 w-24" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-6 w-32" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-6 w-20" />
      </TableCell>
      <TableCell className="text-right">
        <Skeleton className="h-8 w-8 rounded-md ml-auto" />
      </TableCell>
    </TableRow>
  );

  const renderRow = (token: ProcessedTokenData) => (
    <TableRow key={token.symbol}>
      <TableCell>
        <div className="flex items-center gap-3 font-medium">
          <TokenIcon symbol={token.symbol} className="h-10 w-10" />
          {token.symbol}
        </div>
      </TableCell>
      <TableCell>${token.price.toFixed(2)}</TableCell>
      <TableCell>{token.supply.toLocaleString()}</TableCell>
      <TableCell className="font-semibold text-green-600">
        {token.apy}%
      </TableCell>
      <TableCell className="text-right">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => handleOpenAnalysis(token)}
        >
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <span className="sr-only">Analysis for {token.symbol}</span>
        </Button>
      </TableCell>
    </TableRow>
  );

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold">
              Liquid Staking
            </CardTitle>
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              APY
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 cursor-pointer" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Annual Percentage Yield</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Asset</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Total Staked</TableHead>
                <TableHead>APY</TableHead>
                <TableHead className="pr-6 text-right">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <>
                  {renderSkeleton()}
                  {renderSkeleton()}
                </>
              ) : error ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-red-500 py-8"
                  >
                    {error}
                  </TableCell>
                </TableRow>
              ) : data.length > 0 ? (
                data.map(renderRow)
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-muted-foreground py-8"
                  >
                    No token data available.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {selectedToken && (
        <ApyAnalysisDialog
          isOpen={isAnalysisDialogOpen}
          onOpenChange={setIsAnalysisDialogOpen}
          tokenSymbol={selectedToken.symbol}
          apyDetails={selectedToken.apyDetails}
        />
      )}
    </>
  );
}

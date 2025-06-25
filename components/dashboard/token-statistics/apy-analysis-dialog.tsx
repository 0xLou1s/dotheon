"use client";

import {
  TooltipContent,
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Info, X } from "lucide-react";
import type { ApyDetails } from "@/hooks/use-token-data";
import Image from "next/image";
import { ApyChart } from "./apy-chart";

interface ApyAnalysisDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  tokenSymbol: string;
  apyDetails: ApyDetails;
}

interface InfoCardProps {
  title: string;
  value: string;
  color?: string;
  highlight?: boolean;
  className?: string;
}

const InfoCard: React.FC<InfoCardProps> = ({
  title,
  value,
  color,
  highlight = false,
  className,
}) => (
  <Card
    className={cn(
      "p-4",
      highlight ? "bg-indigo-600 text-white" : "bg-white dark:bg-slate-800",
      className
    )}
  >
    <CardContent className="p-0">
      <div className="flex items-center text-xs mb-1">
        {color && (
          <span
            className={`w-2 h-2  mr-2`}
            style={{ backgroundColor: color }}
          />
        )}
        <span
          className={
            highlight ? "text-indigo-200" : "text-slate-500 dark:text-slate-400"
          }
        >
          {title}
        </span>
      </div>
      <p
        className={`text-xl font-bold ${
          highlight ? "text-white" : "text-slate-800 dark:text-white"
        }`}
      >
        {value}
      </p>
    </CardContent>
  </Card>
);

export function ApyAnalysisDialog({
  isOpen,
  onOpenChange,
  tokenSymbol,
  apyDetails,
}: ApyAnalysisDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl p-6 bg-gray-50 dark:bg-slate-900">
        <DialogHeader className="flex flex-row justify-between items-center mb-4">
          <DialogTitle className="text-2xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <span>
              <Image
                src={`/${tokenSymbol.toLowerCase()}.svg`}
                alt={tokenSymbol}
                width={24}
                height={24}
              />
            </span>
            {tokenSymbol} APY Analysis
          </DialogTitle>
          <DialogClose asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-full"
            >
              <X className="h-5 w-5 text-slate-500 dark:text-slate-400" />
            </Button>
          </DialogClose>
        </DialogHeader>

        <div className="grid grid-cols-12 gap-6">
          {/* Left side - Chart */}
          <div className="col-span-12 md:col-span-7 lg:col-span-8">
            <h3 className="text-lg font-semibold mb-3 flex items-center text-slate-700 dark:text-slate-200">
              APY Trend Analysis
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 ml-1.5 text-slate-400 dark:text-slate-500 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Historical APY performance over time.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </h3>
            <div className="bg-white dark:bg-slate-800 overflow-hidden p-4 rounded-lg">
              <div className="h-[350px]">
                <ApyChart tokenSymbol={tokenSymbol} />
              </div>
            </div>
          </div>

          {/* Right side - Stats */}
          <div className="col-span-12 md:col-span-5 lg:col-span-4 space-y-6">
            {/* Base APY section */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center text-slate-700 dark:text-slate-200">
                Base APY
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 ml-1.5 text-slate-400 dark:text-slate-500 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Core Annual Percentage Yield from staking.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <InfoCard
                  title="90 Days APY"
                  value={`${apyDetails.baseApy.ninetyDay}%`}
                  color="#8884d8"
                />
                <InfoCard
                  title="30 Days APY"
                  value={`${apyDetails.baseApy.thirtyDay}%`}
                  color="#82ca9d"
                />
                <InfoCard
                  title="7 Days APY"
                  value={`${apyDetails.baseApy.sevenDay}%`}
                  color="#ffc658"
                />
                <InfoCard
                  title="Network avg. APY"
                  value={`${apyDetails.baseApy.networkAvg}%`}
                  color="#708090"
                />
              </div>
            </div>

            {/* Bifrost incentives section */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center text-slate-700 dark:text-slate-200">
                Bifrost incentives
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 ml-1.5 text-slate-400 dark:text-slate-500 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Additional rewards and multipliers from Bifrost.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <InfoCard
                  title="Single token Farming"
                  value={`${apyDetails.incentives.singleTokenFarming}%`}
                />
                <InfoCard
                  title="LP Farming"
                  value={apyDetails.incentives.lpFarming}
                />
                <InfoCard
                  title="Bonus Multiplier"
                  value={`${apyDetails.incentives.bonusMultiplier}x`}
                />
                <InfoCard
                  title="Expected total APY"
                  value={`${apyDetails.incentives.expectedTotalApy}%`}
                  highlight
                />
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useTokenData } from "@/hooks/use-token-data";
import type { ProcessedTokenData } from "@/hooks/use-token-data";
import { TokenIcon } from "@/components/ui/token-icon";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";

interface RewardCalculatorProps {
  isOpen: boolean;
  onClose: () => void;
  initialTokenSymbol?: string;
}

const RewardCalculator = ({
  isOpen,
  onClose,
  initialTokenSymbol,
}: RewardCalculatorProps) => {
  const [amount, setAmount] = useState<string>("1000");
  const [deductCommission, setDeductCommission] = useState<boolean>(true);
  const { data: tokenData, loading } = useTokenData();
  const [selectedToken, setSelectedToken] = useState<ProcessedTokenData | null>(
    null
  );

  // Set the selected token based on initialTokenSymbol or default to first DOT token
  useEffect(() => {
    if (loading || !tokenData || tokenData.length === 0) return;

    if (initialTokenSymbol) {
      const token = tokenData.find(
        (t) => t.symbol.toLowerCase() === initialTokenSymbol.toLowerCase()
      );
      if (token) {
        setSelectedToken(token);
        return;
      }
    }

    // Default to first DOT-related token
    const dotToken = tokenData.find((t) => t.symbol.includes("DOT"));
    if (dotToken) {
      setSelectedToken(dotToken);
    } else {
      setSelectedToken(tokenData[0]);
    }
  }, [tokenData, loading, initialTokenSymbol]);

  if (!selectedToken) return null;

  // Use fee from token data with a default value if undefined
  const commissionRate =
    selectedToken.fee !== undefined ? selectedToken.fee : 0;

  // Calculate effective APY
  const baseAPY = Number.parseFloat(selectedToken.apy);
  const effectiveAPY = deductCommission
    ? baseAPY * (1 - commissionRate / 100)
    : baseAPY;

  // Calculate rewards
  const calculateRewards = () => {
    const tokenAmount = Number.parseFloat(amount) || 0;
    const tokenPrice = selectedToken.price;
    const dailyReward = tokenAmount * (effectiveAPY / 100 / 365);
    const monthlyReward = dailyReward * 30;
    const annualReward = tokenAmount * (effectiveAPY / 100);

    return {
      daily: {
        token: dailyReward,
        usd: dailyReward * tokenPrice,
      },
      monthly: {
        token: monthlyReward,
        usd: monthlyReward * tokenPrice,
      },
      annual: {
        token: annualReward,
        usd: annualReward * tokenPrice,
      },
    };
  };

  const rewards = calculateRewards();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Reward Calculator</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Token Selection */}
          <div className="space-y-2">
            <Label className="text-sm">Select Token</Label>
            <div className="flex flex-wrap gap-1">
              {tokenData?.slice(0, 4).map((token) => (
                <Button
                  key={token.symbol}
                  variant={
                    selectedToken.symbol === token.symbol
                      ? "default"
                      : "outline"
                  }
                  size="sm"
                  onClick={() => setSelectedToken(token)}
                  className="h-8 px-2 text-xs"
                >
                  <TokenIcon symbol={token.symbol} size={12} />
                  {token.symbol.replace("v", "")}
                </Button>
              ))}
            </div>
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <div className="flex items-center gap-1">
              <Label htmlFor="tokenAmount" className="text-sm">
                {selectedToken.symbol.replace("v", "")} Amount
              </Label>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>
                    Enter the amount of {selectedToken.symbol.replace("v", "")}{" "}
                    you want to stake.
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Input
              id="tokenAmount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="h-9"
            />
          </div>

          {/* Commission Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1">
                <Label htmlFor="commission" className="text-sm">
                  Deduct Commission
                </Label>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>
                      Commission of {commissionRate?.toFixed(2) || "0.00"}% is
                      deducted from your rewards. Toggle this to see rewards
                      with or without commission.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <p className="text-xs text-muted-foreground">
                {commissionRate?.toFixed(2) || "0.00"}%
              </p>
            </div>
            <Switch
              id="commission"
              checked={deductCommission}
              onCheckedChange={setDeductCommission}
            />
          </div>

          {/* Rewards Display */}
          <div className="space-y-3">
            <div className="flex items-center gap-1">
              <Label className="text-sm">Projected Rewards</Label>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>Reward Formula:</p>
                  <ul className="list-disc pl-4 mt-1 space-y-1">
                    <li>Daily: Amount × (APY ÷ 100 ÷ 365)</li>
                    <li>Monthly: Daily × 30</li>
                    <li>Annual: Amount × (APY ÷ 100)</li>
                  </ul>
                  <p className="mt-1">APY: {effectiveAPY.toFixed(2)}%</p>
                </TooltipContent>
              </Tooltip>
            </div>

            {/* Daily Rewards */}
            <div className="flex items-center justify-between py-2 border-b">
              <div className="flex items-center gap-2">
                <TokenIcon symbol={selectedToken.symbol} size={16} />
                <div>
                  <p className="text-sm font-medium">Daily</p>
                  <p className="text-xs text-muted-foreground">
                    ${rewards.daily.usd.toFixed(2)}
                  </p>
                </div>
              </div>
              <p className="text-sm font-medium">
                {rewards.daily.token.toFixed(6)}
              </p>
            </div>

            {/* Monthly Rewards */}
            <div className="flex items-center justify-between py-2 border-b">
              <div className="flex items-center gap-2">
                <TokenIcon symbol={selectedToken.symbol} size={16} />
                <div>
                  <p className="text-sm font-medium">Monthly</p>
                  <p className="text-xs text-muted-foreground">
                    ${rewards.monthly.usd.toFixed(2)}
                  </p>
                </div>
              </div>
              <p className="text-sm font-medium">
                {rewards.monthly.token.toFixed(6)}
              </p>
            </div>

            {/* Annual Rewards */}
            <div className="flex items-center justify-between py-2 border-b">
              <div className="flex items-center gap-2">
                <TokenIcon symbol={selectedToken.symbol} size={16} />
                <div>
                  <p className="text-sm font-medium">Annual</p>
                  <p className="text-xs text-muted-foreground">
                    ${rewards.annual.usd.toFixed(2)}
                  </p>
                </div>
              </div>
              <p className="text-sm font-medium">
                {rewards.annual.token.toFixed(6)}
              </p>
            </div>
          </div>

          {/* APY Info */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-1">
              <p className="text-sm font-medium">Effective APY</p>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>Effective APY Calculation:</p>
                  {deductCommission ? (
                    <p className="mt-1">
                      Base APY × (1 - Commission/100) = {baseAPY.toFixed(2)}% ×
                      (1 - {commissionRate.toFixed(2)}%/100) ={" "}
                      {effectiveAPY.toFixed(2)}%
                    </p>
                  ) : (
                    <p className="mt-1">Base APY = {baseAPY.toFixed(2)}%</p>
                  )}
                </TooltipContent>
              </Tooltip>
              <p className="text-xs text-muted-foreground">
                {deductCommission ? "After commission" : "Before commission"}
              </p>
            </div>
            <p className="text-lg font-bold">{effectiveAPY.toFixed(2)}%</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RewardCalculator;

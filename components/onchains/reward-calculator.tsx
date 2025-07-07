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
import { useBifrostData } from "@/hooks/use-bifrost-data";
import { useTokenPrices } from "@/hooks/use-token-prices";
import { TokenIcon } from "@/components/ui/token-icon";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import { VSTAKING_AVAILABLE } from "@/lib/vstaking-available";
import { formatCurrency } from "@/lib/utils";

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
  const {
    loading: loadingBifrost,
    getAllTokens,
    getTokenData,
  } = useBifrostData();
  const { loading: loadingPrices, getTokenPrice } = useTokenPrices();
  const [selectedToken, setSelectedToken] = useState<string | null>(null);

  // Set the selected token based on initialTokenSymbol or default to first DOT token
  useEffect(() => {
    if (loadingBifrost) return;

    const tokens = getAllTokens().filter(
      ({ symbol }) =>
        VSTAKING_AVAILABLE[symbol as keyof typeof VSTAKING_AVAILABLE]
    );

    if (tokens.length === 0) return;

    if (initialTokenSymbol) {
      const token = tokens.find(
        (t) => t.symbol.toLowerCase() === initialTokenSymbol.toLowerCase()
      );
      if (token) {
        setSelectedToken(token.symbol);
        return;
      }
    }

    // Default to first DOT-related token
    const dotToken = tokens.find((t) => t.symbol.includes("DOT"));
    if (dotToken) {
      setSelectedToken(dotToken.symbol);
    } else {
      setSelectedToken(tokens[0].symbol);
    }
  }, [loadingBifrost, initialTokenSymbol]);

  if (!selectedToken) return null;

  const tokenData = getTokenData(selectedToken);
  if (!tokenData) return null;

  // Calculate effective APY
  const baseAPY = Number(tokenData.apyBase || tokenData.apy || "0");
  const rewardAPY = Number(tokenData.apyReward || "0");
  const mevAPY = Number(tokenData.mevApy || "0");
  const gasAPY = Number(tokenData.gasFeeApy || "0");

  const totalAPY = tokenData.totalApy
    ? Number(tokenData.totalApy)
    : baseAPY + rewardAPY + mevAPY + gasAPY;

  const effectiveAPY = totalAPY;

  // Calculate rewards
  const calculateRewards = () => {
    const tokenAmount = Number.parseFloat(amount) || 0;
    const dailyReward = tokenAmount * (effectiveAPY / 100 / 365);
    const monthlyReward = dailyReward * 30;
    const annualReward = tokenAmount * (effectiveAPY / 100);

    // Get token price for the vToken
    const tokenPrice = getTokenPrice(selectedToken);

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
  const availableTokens = getAllTokens().filter(
    ({ symbol }) =>
      VSTAKING_AVAILABLE[symbol as keyof typeof VSTAKING_AVAILABLE]
  );

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
              {availableTokens.map((token) => (
                <Button
                  key={token.symbol}
                  variant={
                    selectedToken === token.symbol ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setSelectedToken(token.symbol)}
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
                {selectedToken.replace("v", "")} Amount
              </Label>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>
                    Enter the amount of {selectedToken.replace("v", "")} you
                    want to stake.
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
                <TokenIcon symbol={selectedToken} size={16} />
                <div>
                  <p className="text-sm font-medium">Daily</p>
                  <p className="text-xs text-muted-foreground">
                    {formatCurrency(rewards.daily.usd)}
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
                <TokenIcon symbol={selectedToken} size={16} />
                <div>
                  <p className="text-sm font-medium">Monthly</p>
                  <p className="text-xs text-muted-foreground">
                    {formatCurrency(rewards.monthly.usd)}
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
                <TokenIcon symbol={selectedToken} size={16} />
                <div>
                  <p className="text-sm font-medium">Annual</p>
                  <p className="text-xs text-muted-foreground">
                    {formatCurrency(rewards.annual.usd)}
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
              <p className="text-sm font-medium">Total APY</p>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>APY Breakdown:</p>
                  <ul className="list-disc pl-4 mt-1 space-y-1">
                    <li>Base APY: {baseAPY.toFixed(2)}%</li>
                    {rewardAPY > 0 && (
                      <li>Reward APY: {rewardAPY.toFixed(2)}%</li>
                    )}
                    {mevAPY > 0 && <li>MEV APY: {mevAPY.toFixed(2)}%</li>}
                    {gasAPY > 0 && <li>Gas APY: {gasAPY.toFixed(2)}%</li>}
                  </ul>
                </TooltipContent>
              </Tooltip>
            </div>
            <p className="text-lg font-bold">{effectiveAPY.toFixed(2)}%</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RewardCalculator;

"use client";

import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useWaitForTransactionReceipt,
  useWriteContract,
  useReadContracts,
  useReadContract,
  useCapabilities,
  useSendCalls,
  useAccount,
  useChainId,
  useConfig,
  useWaitForCallsStatus,
  useCallsStatus,
  useBalance,
} from "wagmi";
import { l2SlpxAbi } from "@/lib/abis";
import { L2SLPX_CONTRACT_ADDRESS } from "@/lib/constants";
import type { Token } from "@/types/token";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import { roundLongDecimals } from "@/lib/utils";
import { formatEther, parseEther, erc20Abi, Address, maxUint256 } from "viem";
import { Loader2, RefreshCw, CheckCircle, XCircle } from "lucide-react";
import { TransactionStatus } from "@/components/onchains/transaction-status";
import { TOKEN_LIST } from "@/lib/constants";
import { TokenIcon } from "@/components/ui/token-icon";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

// Extract tokens for redeeming
const tokens: Token[] = TOKEN_LIST.filter(
  (token) => token.symbol == "ETH" || token.symbol == "DOT"
);

interface ChatRedeemProps {
  initialToken?: string;
  initialAmount?: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export default function ChatRedeem({
  initialToken,
  initialAmount = "",
  onSuccess,
  onError,
}: ChatRedeemProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [open, setOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [amount, setAmount] = useState(initialAmount);
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const config = useConfig();
  const { address } = useAccount();
  const chainId = useChainId();
  const { data: availableCapabilities } = useCapabilities({
    account: address,
    chainId: chainId,
  });

  // Initialize with initial token
  useEffect(() => {
    if (initialToken) {
      const token = tokens.find((token) => {
        if (initialToken === "vETH") return token.symbol === "ETH";
        if (initialToken === "vDOT") return token.symbol === "DOT";
        return false;
      });

      if (token) {
        setSelectedToken(token);
      }
    }
  }, [initialToken]);

  // Get native balance (ETH)
  const {
    data: nativeBalance,
    isLoading: isLoadingNativeBalance,
    refetch: refetchNativeBalance,
  } = useBalance({
    address: address,
  });

  // Get vToken balances (vETH, vDOT)
  const {
    data: vTokenBalances,
    isLoading: isVTokenBalancesLoading,
    refetch: refetchVTokenBalances,
  } = useReadContracts({
    contracts: [
      // vETH
      {
        abi: erc20Abi,
        address: TOKEN_LIST.filter((token) => token.symbol === "vETH")[0]
          .address as Address,
        functionName: "balanceOf",
        args: [address as Address],
      },
      // vDOT
      {
        abi: erc20Abi,
        address: TOKEN_LIST.filter((token) => token.symbol === "vDOT")[0]
          .address as Address,
        functionName: "balanceOf",
        args: [address as Address],
      },
    ],
  });

  // Get DOT balance for redeem
  const {
    data: dotBalance,
    isLoading: isDotBalanceLoading,
    refetch: refetchDotBalance,
  } = useReadContract({
    address: TOKEN_LIST.filter((token) => token.symbol === "DOT")[0]
      .address as Address,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [address as Address],
  });

  const { data: tokenAllowances, refetch: refetchTokenAllowances } =
    useReadContracts({
      contracts: [
        {
          address: TOKEN_LIST.filter((token) => token.symbol === "vETH")[0]
            .address as Address,
          abi: erc20Abi,
          functionName: "allowance",
          args: [address as Address, L2SLPX_CONTRACT_ADDRESS],
        },
        {
          address: TOKEN_LIST.filter((token) => token.symbol === "vDOT")[0]
            .address as Address,
          abi: erc20Abi,
          functionName: "allowance",
          args: [address as Address, L2SLPX_CONTRACT_ADDRESS],
        },
      ],
    });

  // Redeeming
  const { data: hash, error, isPending, writeContract } = useWriteContract();

  // Batching
  const {
    data: batchCallsId,
    isPending: isBatching,
    error: batchError,
    sendCalls,
  } = useSendCalls();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const { isLoading: isSendingCalls, isSuccess: isSendingCallsSuccess } =
    useWaitForCallsStatus({
      id: batchCallsId?.id,
    });

  const { data: batchCallsStatus } = useCallsStatus(
    batchCallsId
      ? {
          id: batchCallsId.id,
        }
      : {
          id: "",
        }
  );

  useEffect(() => {
    if (isConfirmed || isSendingCallsSuccess) {
      refetchTokenAllowances();
      refetchNativeBalance();
      refetchVTokenBalances();
      refetchDotBalance();
      setIsLoading(false);
      toast.success("Redemption successful! 🎉");
      onSuccess?.();
    }
  }, [
    isConfirmed,
    isSendingCallsSuccess,
    refetchTokenAllowances,
    refetchNativeBalance,
    refetchVTokenBalances,
    refetchDotBalance,
    onSuccess,
  ]);

  useEffect(() => {
    if (error || batchError) {
      setIsLoading(false);
      setLocalError(
        error?.message || batchError?.message || "Redemption failed"
      );
      const errorMessage =
        error?.message || batchError?.message || "Redemption failed";
      toast.error(errorMessage);
      onError?.(errorMessage);
    }
  }, [error, batchError, onError]);

  useEffect(() => {
    if (isConfirming || isSendingCalls) {
      setOpen(true);
    }
  }, [isConfirming, isSendingCalls]);

  // Reset local states when component mounts or when transaction states change
  useEffect(() => {
    // Reset local loading state when no transaction is in progress
    if (!isPending && !isBatching && !isSendingCalls && !isConfirming) {
      setIsLoading(false);
      setLocalError(null);
    }
  }, [isPending, isBatching, isSendingCalls, isConfirming]);

  const handleRedeem = async () => {
    if (!selectedToken || !amount || !address) return;

    setIsLoading(true);

    try {
      // Redeem ETH
      if (selectedToken?.symbol === "ETH") {
        if (availableCapabilities?.[chainId]?.atomic?.status === "supported") {
          sendCalls({
            calls: [
              {
                to: TOKEN_LIST.filter((token) => token.symbol === "vETH")[0]
                  .address as Address,
                abi: erc20Abi,
                functionName: "approve",
                args: [L2SLPX_CONTRACT_ADDRESS, parseEther(amount)],
              },
              {
                to: L2SLPX_CONTRACT_ADDRESS,
                abi: l2SlpxAbi,
                functionName: "createOrder",
                args: [
                  TOKEN_LIST.filter((token) => token.symbol === "vETH")[0]
                    .address as Address,
                  parseEther(amount),
                  1,
                  "bifrost",
                ],
              },
            ],
          });
        } else {
          if (
            tokenAllowances?.[0]?.status === "success" &&
            tokenAllowances?.[0]?.result === BigInt(0)
          ) {
            await writeContract({
              address: TOKEN_LIST.filter((token) => token.symbol === "vETH")[0]
                .address as Address,
              abi: erc20Abi,
              functionName: "approve",
              args: [L2SLPX_CONTRACT_ADDRESS, maxUint256],
            });
          }

          if (
            tokenAllowances?.[0]?.status === "success" &&
            tokenAllowances?.[0]?.result >= parseEther(amount)
          ) {
            writeContract({
              address: L2SLPX_CONTRACT_ADDRESS,
              abi: l2SlpxAbi,
              functionName: "createOrder",
              args: [
                TOKEN_LIST.filter((token) => token.symbol === "vETH")[0]
                  .address as Address,
                parseEther(amount),
                1,
                "bifrost",
              ],
            });
          }
        }
      }

      // Redeem DOT
      if (selectedToken?.symbol === "DOT") {
        if (availableCapabilities?.[chainId]?.atomic?.status === "supported") {
          sendCalls({
            calls: [
              {
                to: TOKEN_LIST.filter((token) => token.symbol === "vDOT")[0]
                  .address as Address,
                abi: erc20Abi,
                functionName: "approve",
                args: [L2SLPX_CONTRACT_ADDRESS, parseEther(amount)],
              },
              {
                to: L2SLPX_CONTRACT_ADDRESS,
                abi: l2SlpxAbi,
                functionName: "createOrder",
                args: [
                  TOKEN_LIST.filter((token) => token.symbol === "vDOT")[0]
                    .address as Address,
                  parseEther(amount),
                  1,
                  "bifrost",
                ],
              },
            ],
          });
        } else {
          if (
            tokenAllowances?.[1]?.status === "success" &&
            tokenAllowances?.[1]?.result === BigInt(0)
          ) {
            await writeContract({
              address: TOKEN_LIST.filter((token) => token.symbol === "vDOT")[0]
                .address as Address,
              abi: erc20Abi,
              functionName: "approve",
              args: [L2SLPX_CONTRACT_ADDRESS, maxUint256],
            });
          }

          if (
            tokenAllowances?.[1]?.status === "success" &&
            tokenAllowances?.[1]?.result >= parseEther(amount)
          ) {
            await writeContract({
              address: L2SLPX_CONTRACT_ADDRESS,
              abi: l2SlpxAbi,
              functionName: "createOrder",
              args: [
                TOKEN_LIST.filter((token) => token.symbol === "vDOT")[0]
                  .address as Address,
                parseEther(amount),
                1,
                "bifrost",
              ],
            });
          }
        }
      }
    } catch (error) {
      setIsLoading(false);
      toast.error("Failed to initiate redemption");
      onError?.("Failed to initiate redemption");
    }
  };

  const isProcessing =
    isPending || isBatching || isSendingCalls || isConfirming || isLoading;

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <RefreshCw className="h-5 w-5" />
          Redeem {selectedToken?.symbol ? `v${selectedToken.symbol}` : "vToken"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Token Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Token to Redeem</label>
          <Select
            value={selectedToken?.symbol || ""}
            onValueChange={(value) => {
              const token = tokens.find((token) => token.symbol === value);
              if (token) {
                setSelectedToken(token);
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose token to redeem" />
            </SelectTrigger>
            <SelectContent>
              {tokens.map((token) => (
                <SelectItem key={token.symbol} value={token.symbol}>
                  <div className="flex items-center gap-2">
                    <TokenIcon symbol={token.symbol} size={20} />
                    <span>{token.symbol}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Balance Display */}
        {selectedToken && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Your Balance</label>
              <button
                type="button"
                onClick={() => {
                  refetchNativeBalance();
                  refetchVTokenBalances();
                  refetchDotBalance();
                }}
                disabled={
                  isLoadingNativeBalance ||
                  isVTokenBalancesLoading ||
                  isDotBalanceLoading
                }
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {isLoadingNativeBalance ||
                isVTokenBalancesLoading ||
                isDotBalanceLoading ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  "🔄 Refresh"
                )}
              </button>
            </div>
            <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-md">
              {isLoadingNativeBalance ||
              isVTokenBalancesLoading ||
              isDotBalanceLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Loading balances...</span>
                </div>
              ) : (
                <div className="space-y-1">
                  {selectedToken.symbol === "ETH" ? (
                    <div className="flex justify-between">
                      <span>vETH:</span>
                      <span className="font-medium">
                        {roundLongDecimals(
                          formatEther(vTokenBalances?.[0]?.result ?? BigInt(0)),
                          4
                        )}{" "}
                        vETH
                      </span>
                    </div>
                  ) : (
                    <div className="flex justify-between">
                      <span>vDOT:</span>
                      <span className="font-medium">
                        {roundLongDecimals(
                          formatEther(vTokenBalances?.[1]?.result ?? BigInt(0)),
                          4
                        )}{" "}
                        vDOT
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Base {selectedToken.symbol}:</span>
                    <span className="font-medium">
                      {selectedToken.symbol === "ETH"
                        ? roundLongDecimals(
                            formatEther(nativeBalance?.value ?? BigInt(0)),
                            4
                          )
                        : roundLongDecimals(
                            formatEther(dotBalance ?? BigInt(0)),
                            4
                          )}{" "}
                      {selectedToken.symbol}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Amount Input */}
        {selectedToken && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Amount</label>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="0.0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="flex-1"
                disabled={isProcessing}
              />
              <span className="text-sm text-muted-foreground self-center">
                {selectedToken.symbol === "ETH" ? "vETH" : "vDOT"}
              </span>
            </div>
          </div>
        )}

        {/* Redeem Button */}
        <Button
          onClick={handleRedeem}
          disabled={!selectedToken || !amount || isProcessing}
          className="w-full"
          size="lg"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Processing...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Redeem{" "}
              {selectedToken?.symbol ? `v${selectedToken.symbol}` : "vToken"}
            </>
          )}
        </Button>

        {/* Status Indicators */}
        {isProcessing && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Confirming transaction in wallet...</span>
          </div>
        )}

        {isConfirmed || isSendingCallsSuccess ? (
          <div className="flex items-center gap-2 text-sm text-green-600">
            <CheckCircle className="h-4 w-4" />
            <span>Redemption successful!</span>
          </div>
        ) : null}

        {error || batchError ? (
          <div className="flex items-center gap-2 text-sm text-red-600">
            <XCircle className="h-4 w-4" />
            <span>Transaction failed</span>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

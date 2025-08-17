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
  useReadContract,
  useWriteContract,
  useCapabilities,
  useSendCalls,
  useAccount,
  useChainId,
  useConfig,
  useWaitForCallsStatus,
  useCallsStatus,
  useBalance,
  useReadContracts,
} from "wagmi";
import type { Token } from "@/types/token";
import { TOKEN_LIST, L2SLPX_CONTRACT_ADDRESS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { parseEther, formatEther, Address, maxUint256, erc20Abi } from "viem";
import { roundLongDecimals } from "@/lib/utils";
import { Loader2, Coins, CheckCircle, XCircle } from "lucide-react";
import { l2SlpxAbi } from "@/lib/abis";
import { TokenIcon } from "@/components/ui/token-icon";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const tokens: Token[] = TOKEN_LIST.filter(
  (token) => token.symbol === "vDOT" || token.symbol === "vETH"
);

interface ChatMintProps {
  initialToken?: string;
  initialAmount?: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export default function ChatMint({
  initialToken,
  initialAmount = "",
  onSuccess,
  onError,
}: ChatMintProps) {
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [amount, setAmount] = useState(initialAmount);
  const [open, setOpen] = useState(false);
  const [stakingData, setStakingData] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingStakingData, setIsLoadingStakingData] = useState(false);

  const config = useConfig();
  const chainId = useChainId();
  const { address } = useAccount();
  const { data: availableCapabilities } = useCapabilities({
    account: address,
    chainId: chainId,
  });

  // Initialize with initial token
  useEffect(() => {
    if (initialToken) {
      const token = tokens.find((t) => t.symbol === initialToken);
      if (token) {
        setSelectedToken(token);
      }
    }
  }, [initialToken]);

  // Reset submitting state when component mounts
  useEffect(() => {
    setIsSubmitting(false);
  }, []);

  // Fetch staking data
  useEffect(() => {
    const fetchStakingData = async () => {
      setIsLoadingStakingData(true);
      try {
        const response = await fetch("https://dapi.bifrost.io/api/staking");
        const data = await response.json();
        setStakingData(data);
      } catch (error) {
        console.error("Error fetching staking data:", error);
      } finally {
        setIsLoadingStakingData(false);
      }
    };

    fetchStakingData();
  }, []);

  // Get native balance (ETH)
  const {
    data: nativeBalance,
    isLoading: isLoadingNativeBalance,
    refetch: refetchNativeBalance,
  } = useBalance({
    address: address,
  });

  // Get token balances (DOT, vETH, vDOT)
  const {
    data: tokenBalances,
    isLoading: isTokenBalancesLoading,
    refetch: refetchTokenBalances,
  } = useReadContracts({
    contracts: [
      // DOT
      {
        abi: erc20Abi,
        address: TOKEN_LIST.filter((token) => token.symbol === "DOT")[0]
          .address as Address,
        functionName: "balanceOf",
        args: [address as Address],
      },
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

  const { data: tokenAllowance, refetch: refetchTokenAllowance } =
    useReadContract({
      address: TOKEN_LIST.filter((token) => token.symbol === "DOT")[0]
        .address as Address,
      abi: erc20Abi,
      functionName: "allowance",
      args: [address as Address, L2SLPX_CONTRACT_ADDRESS],
    });

  const { data: hash, error, isPending, writeContract } = useWriteContract();
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

  const { isLoading: isSendingCalls } = useWaitForCallsStatus({
    id: batchCallsId?.id,
  });

  const {
    data: batchCallsStatus,
    isLoading: isBatchCallsLoading,
    isSuccess: isBatchCallsSuccess,
  } = useCallsStatus(
    batchCallsId
      ? {
          id: batchCallsId.id,
        }
      : {
          id: "",
        }
  );

  useEffect(() => {
    if (isConfirming || isSendingCalls) {
      setOpen(true);
    }
  }, [isConfirming, isSendingCalls]);

  useEffect(() => {
    if (isConfirmed || isBatchCallsSuccess) {
      refetchTokenAllowance();
      refetchNativeBalance();
      refetchTokenBalances();
      setIsSubmitting(false);
      toast.success("Minting successful! 🎉");
      onSuccess?.();
    }
  }, [
    isConfirmed,
    isBatchCallsSuccess,
    refetchTokenAllowance,
    refetchNativeBalance,
    refetchTokenBalances,
    onSuccess,
  ]);

  useEffect(() => {
    if (error || batchError) {
      setIsSubmitting(false);
      const errorMessage =
        error?.message || batchError?.message || "Minting failed";
      toast.error(errorMessage);
      onError?.(errorMessage);
    }
  }, [error, batchError, onError]);

  const handleMint = async () => {
    if (!selectedToken || !amount || !address) return;

    setIsSubmitting(true);

    try {
      if (selectedToken?.symbol === "vETH") {
        writeContract({
          address: L2SLPX_CONTRACT_ADDRESS,
          abi: l2SlpxAbi,
          functionName: "createOrder",
          value: parseEther(amount),
          args: [
            "0x0000000000000000000000000000000000000000",
            parseEther(amount),
            0,
            "bifrost",
          ],
        });
      }

      if (selectedToken?.symbol === "vDOT") {
        if (availableCapabilities?.[chainId]?.atomic?.status === "supported") {
          sendCalls({
            calls: [
              {
                to: TOKEN_LIST.filter((token) => token.symbol === "DOT")[0]
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
                  TOKEN_LIST.filter((token) => token.symbol === "DOT")[0]
                    .address as Address,
                  parseEther(amount),
                  0,
                  "bifrost",
                ],
              },
            ],
          });
        } else {
          if (tokenAllowance === BigInt(0)) {
            await writeContract({
              address: TOKEN_LIST.filter((token) => token.symbol === "DOT")[0]
                .address as Address,
              abi: erc20Abi,
              functionName: "approve",
              args: [L2SLPX_CONTRACT_ADDRESS, maxUint256],
            });
          }

          if (tokenAllowance && tokenAllowance >= parseEther(amount)) {
            writeContract({
              address: L2SLPX_CONTRACT_ADDRESS,
              abi: l2SlpxAbi,
              functionName: "createOrder",
              args: [
                TOKEN_LIST.filter((token) => token.symbol === "DOT")[0]
                  .address as Address,
                parseEther(amount),
                0,
                "bifrost",
              ],
            });
          }
        }
      }
    } catch (error) {
      setIsSubmitting(false);
      toast.error("Failed to initiate minting");
      onError?.("Failed to initiate minting");
    }
  };

  const getExchangeRatio = (symbol: string | undefined) => {
    if (!symbol || !stakingData) return null;

    const asset = stakingData.supportedAssets.find(
      (asset: any) => asset.symbol === symbol
    );

    return asset?.exchangeRatio || null;
  };

  const calculateExpectedAmount = (
    inputAmount: string,
    exchangeRatio: number | null
  ) => {
    if (!inputAmount || !exchangeRatio) return "0";

    try {
      const amount = parseFloat(inputAmount);
      const expected = amount / exchangeRatio;
      return roundLongDecimals(expected.toString(), 6);
    } catch (e) {
      return "0";
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Coins className="h-5 w-5" />
          Mint {selectedToken?.symbol || "vToken"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Token Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Token</label>
          <Select
            value={selectedToken?.symbol || ""}
            onValueChange={(value) => {
              const token = tokens.find((t) => t.symbol === value);
              setSelectedToken(token || null);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose token to mint" />
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
                  refetchTokenBalances();
                }}
                disabled={isLoadingNativeBalance || isTokenBalancesLoading}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {isLoadingNativeBalance || isTokenBalancesLoading ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  "🔄 Refresh"
                )}
              </button>
            </div>
            <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-md">
              {isLoadingNativeBalance || isTokenBalancesLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Loading balances...</span>
                </div>
              ) : (
                <div className="space-y-1">
                  {selectedToken.symbol === "vETH" ? (
                    <div className="flex justify-between">
                      <span>ETH:</span>
                      <span className="font-medium">
                        {roundLongDecimals(
                          formatEther(nativeBalance?.value ?? BigInt(0)),
                          4
                        )}{" "}
                        ETH
                      </span>
                    </div>
                  ) : (
                    <div className="flex justify-between">
                      <span>DOT:</span>
                      <span className="font-medium">
                        {roundLongDecimals(
                          formatEther(tokenBalances?.[0]?.result ?? BigInt(0)),
                          4
                        )}{" "}
                        DOT
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>v{selectedToken.symbol.replace("v", "")}:</span>
                    <span className="font-medium">
                      {selectedToken.symbol === "vETH"
                        ? roundLongDecimals(
                            formatEther(
                              tokenBalances?.[1]?.result ?? BigInt(0)
                            ),
                            4
                          )
                        : roundLongDecimals(
                            formatEther(
                              tokenBalances?.[2]?.result ?? BigInt(0)
                            ),
                            4
                          )}{" "}
                      v{selectedToken.symbol.replace("v", "")}
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
                disabled={
                  isSubmitting || isPending || isBatching || isSendingCalls
                }
              />
              <span className="text-sm text-muted-foreground self-center">
                {selectedToken.symbol === "vETH" ? "ETH" : "DOT"}
              </span>
            </div>

            {/* Percentage Buttons */}
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => {
                  const availableBalance =
                    selectedToken?.symbol === "vETH"
                      ? nativeBalance?.value ?? BigInt(0)
                      : tokenBalances?.[0]?.result ?? BigInt(0);
                  const percentageAmount =
                    (availableBalance * BigInt(25)) / BigInt(100);
                  setAmount(
                    roundLongDecimals(formatEther(percentageAmount), 4)
                  );
                }}
                className="bg-transparent border border-muted-foreground text-muted-foreground rounded-md px-2 py-1 hover:cursor-pointer hover:bg-muted/10 text-xs"
                disabled={
                  isSubmitting || isPending || isBatching || isSendingCalls
                }
              >
                25%
              </button>
              <button
                type="button"
                onClick={() => {
                  const availableBalance =
                    selectedToken?.symbol === "vETH"
                      ? nativeBalance?.value ?? BigInt(0)
                      : tokenBalances?.[0]?.result ?? BigInt(0);
                  const percentageAmount =
                    (availableBalance * BigInt(50)) / BigInt(100);
                  setAmount(
                    roundLongDecimals(formatEther(percentageAmount), 4)
                  );
                }}
                className="bg-transparent border border-muted-foreground text-muted-foreground rounded-md px-2 py-1 hover:cursor-pointer hover:bg-muted/10 text-xs"
                disabled={
                  isSubmitting || isPending || isBatching || isSendingCalls
                }
              >
                50%
              </button>
              <button
                type="button"
                onClick={() => {
                  const availableBalance =
                    selectedToken?.symbol === "vETH"
                      ? nativeBalance?.value ?? BigInt(0)
                      : tokenBalances?.[0]?.result ?? BigInt(0);
                  const percentageAmount =
                    (availableBalance * BigInt(75)) / BigInt(100);
                  setAmount(
                    roundLongDecimals(formatEther(percentageAmount), 4)
                  );
                }}
                className="bg-transparent border border-muted-foreground text-muted-foreground rounded-md px-2 py-1 hover:cursor-pointer hover:bg-muted/10 text-xs"
                disabled={
                  isSubmitting || isPending || isBatching || isSendingCalls
                }
              >
                75%
              </button>
              <button
                type="button"
                onClick={() => {
                  const availableBalance =
                    selectedToken?.symbol === "vETH"
                      ? nativeBalance?.value ?? BigInt(0)
                      : tokenBalances?.[0]?.result ?? BigInt(0);
                  // For max, leave a small amount for gas (if ETH)
                  const maxAmount =
                    selectedToken?.symbol === "vETH"
                      ? availableBalance > BigInt(1e16) // Leave 0.01 ETH for gas
                        ? availableBalance - BigInt(1e16)
                        : BigInt(0)
                      : availableBalance;
                  setAmount(roundLongDecimals(formatEther(maxAmount), 4));
                }}
                className="bg-transparent border border-muted-foreground text-muted-foreground rounded-md px-2 py-1 hover:cursor-pointer hover:bg-muted/10 text-xs"
                disabled={
                  isSubmitting || isPending || isBatching || isSendingCalls
                }
              >
                Max
              </button>
            </div>

            {/* Exchange Ratio Info */}
            {amount && (
              <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                <div className="flex justify-between">
                  <span>Exchange Ratio:</span>
                  <span>
                    1 {selectedToken.symbol} ={" "}
                    {getExchangeRatio(selectedToken.symbol) || "..."}{" "}
                    {selectedToken.symbol.replace("v", "")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>You'll receive:</span>
                  <span>
                    {calculateExpectedAmount(
                      amount,
                      getExchangeRatio(selectedToken.symbol)
                    )}{" "}
                    {selectedToken.symbol}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Mint Button */}
        <Button
          onClick={handleMint}
          disabled={
            !selectedToken ||
            !amount ||
            isSubmitting ||
            isPending ||
            isBatching ||
            isSendingCalls
          }
          className="w-full"
          size="lg"
        >
          {isSubmitting || isPending || isBatching ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Please confirm in wallet
            </>
          ) : isSendingCalls ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Sending...
            </>
          ) : (
            <>
              <Coins className="h-4 w-4 mr-2" />
              Mint {selectedToken?.symbol || "vToken"}
            </>
          )}
        </Button>

        {/* Status Indicators */}
        {(isSubmitting || isPending || isBatching) && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Please confirm in wallet...</span>
          </div>
        )}

        {isSendingCalls && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Sending transaction...</span>
          </div>
        )}

        {isConfirmed || isBatchCallsSuccess ? (
          <div className="flex items-center gap-2 text-sm text-green-600">
            <CheckCircle className="h-4 w-4" />
            <span>Minting successful!</span>
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

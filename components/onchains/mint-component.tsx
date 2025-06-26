"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  type BaseError,
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
} from "wagmi";
import type { Token } from "@/types/token";
import Image from "next/image";
import { TOKEN_LIST, L2SLPX_CONTRACT_ADDRESS } from "@/lib/constants";
import { useForm } from "@tanstack/react-form";
import type { AnyFieldApi } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import { MintProps } from "@/types/shared";
import { parseEther, formatEther, Address, maxUint256, erc20Abi } from "viem";
import { useMediaQuery } from "@/hooks/use-media-query";
import { roundLongDecimals } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { TransactionStatus } from "@/components/onchains/transaction-status";
import { l2SlpxAbi } from "@/lib/abis";
import { TokenIcon } from "@/components/ui/token-icon";

// Define interface for the API response
interface StakingAsset {
  contractAddress: string;
  symbol: string;
  slug: string;
  baseSlug: string;
  unstakingTime: number;
  users: number;
  apr: number;
  fee: number;
  price: number;
  exchangeRatio: number;
  supply: number;
}

interface StakingApiResponse {
  name: string;
  supportedAssets: StakingAsset[];
}

const tokens: Token[] = TOKEN_LIST.filter(
  (token) => token.symbol === "vDOT" || token.symbol === "vETH"
);

export default function MintComponent({
  nativeBalance,
  tokenBalances,
  initialTokenSymbol,
  onTokenChange,
}: MintProps) {
  const searchParams = useSearchParams();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [open, setOpen] = useState(false);
  const [stakingData, setStakingData] = useState<StakingApiResponse | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const config = useConfig();
  const chainId = useChainId();
  const { address } = useAccount();
  const router = useRouter();
  const pathname = usePathname();
  const { data: availableCapabilities } = useCapabilities({
    account: address,
    chainId: chainId,
  });

  // Handle token selection from URL parameter
  useEffect(() => {
    const tokenParam = searchParams.get("token");

    if (!tokenParam) return;

    console.log("Initializing from URL parameter:", tokenParam);

    // Handle dot token param
    if (
      tokenParam.toLowerCase() === "dot" ||
      tokenParam.toLowerCase() === "vdot"
    ) {
      const dotToken = tokens.find((t) => t.symbol === "vDOT");
      if (dotToken) {
        console.log("Setting token to vDOT");
        setSelectedToken(dotToken);
      }
    }

    // Handle eth token param
    if (
      tokenParam.toLowerCase() === "eth" ||
      tokenParam.toLowerCase() === "veth"
    ) {
      const ethToken = tokens.find((t) => t.symbol === "vETH");
      if (ethToken) {
        console.log("Setting token to vETH");
        setSelectedToken(ethToken);
      }
    }
  }, [searchParams, tokens, setSelectedToken]);

  // Handle token selection from prop
  useEffect(() => {
    if (initialTokenSymbol) {
      console.log("Initializing from prop:", initialTokenSymbol);

      if (initialTokenSymbol === "vDOT") {
        const dotToken = tokens.find((t) => t.symbol === "vDOT");
        if (dotToken) {
          console.log("Setting token to vDOT from prop");
          setSelectedToken(dotToken);
        }
      } else if (initialTokenSymbol === "vETH") {
        const ethToken = tokens.find((t) => t.symbol === "vETH");
        if (ethToken) {
          console.log("Setting token to vETH from prop");
          setSelectedToken(ethToken);
        }
      }
    }
  }, [initialTokenSymbol, tokens]);

  // Fetch staking data from API
  useEffect(() => {
    const fetchStakingData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("https://dapi.bifrost.io/api/staking");
        const data = await response.json();
        setStakingData(data);
      } catch (error) {
        console.error("Error fetching staking data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStakingData();
  }, []);

  // Get exchange ratio for selected token
  const getExchangeRatio = (symbol: string | undefined) => {
    if (!symbol || !stakingData) return null;

    const asset = stakingData.supportedAssets.find(
      (asset) => asset.symbol === symbol
    );

    return asset?.exchangeRatio || null;
  };

  const { data: tokenAllowance, refetch: refetchTokenAllowance } =
    useReadContract({
      address: TOKEN_LIST.filter((token) => token.symbol === "DOT")[0]
        .address as Address,
      abi: erc20Abi,
      functionName: "allowance",
      args: [address as Address, L2SLPX_CONTRACT_ADDRESS],
    });

  const { data: hash, error, isPending, writeContract } = useWriteContract();

  // Batching
  const {
    data: batchCallsId,
    isPending: isBatching,
    error: batchError,
    sendCalls,
  } = useSendCalls();

  const form = useForm({
    defaultValues: {
      amount: "",
    },
    onSubmit: async ({ value }) => {
      if (selectedToken?.symbol === "vETH") {
        writeContract({
          address: L2SLPX_CONTRACT_ADDRESS,
          abi: l2SlpxAbi,
          functionName: "createOrder",
          value: parseEther(value.amount),
          args: [
            "0x0000000000000000000000000000000000000000",
            parseEther(value.amount),
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
                args: [L2SLPX_CONTRACT_ADDRESS, parseEther(value.amount)],
              },
              {
                to: L2SLPX_CONTRACT_ADDRESS,
                abi: l2SlpxAbi,
                functionName: "createOrder",
                args: [
                  TOKEN_LIST.filter((token) => token.symbol === "DOT")[0]
                    .address as Address,
                  parseEther(value.amount),
                  0,
                  "bifrost",
                ],
              },
            ],
          });
        }

        if (availableCapabilities?.[chainId]?.atomic?.status !== "supported") {
          if (tokenAllowance === BigInt(0)) {
            writeContract({
              address: TOKEN_LIST.filter((token) => token.symbol === "DOT")[0]
                .address as Address,
              abi: erc20Abi,
              functionName: "approve",
              args: [L2SLPX_CONTRACT_ADDRESS, maxUint256],
            });
          }

          if (tokenAllowance && tokenAllowance >= parseEther(value.amount)) {
            writeContract({
              address: L2SLPX_CONTRACT_ADDRESS,
              abi: l2SlpxAbi,
              functionName: "createOrder",
              args: [
                TOKEN_LIST.filter((token) => token.symbol === "DOT")[0]
                  .address as Address,
                parseEther(value.amount),
                0,
                "bifrost",
              ],
            });
          }
        }
      }
    },
  });

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
    if (isConfirmed) {
      refetchTokenAllowance();
    }
  }, [isConfirmed, refetchTokenAllowance]);

  // Calculate expected amount of vTokens based on exchange ratio
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

  // Log when selectedToken changes
  useEffect(() => {
    if (selectedToken) {
      console.log("Selected token changed to:", selectedToken.symbol);
    }
  }, [selectedToken]);

  return (
    <div className="flex flex-col gap-4 w-full p-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Mint</h1>
        <p className="text-muted-foreground">Mint Liquid Staking Tokens</p>
      </div>
      <form
        onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          e.stopPropagation();
          // Always handle submit when the submit button is clicked
          form.handleSubmit();
        }}
      >
        <div className="flex flex-col gap-4">
          <div className="token-selector-container">
            <Select
              onValueChange={(value) => {
                console.log("Select value changed to:", value);
                const token = tokens.find((token) => token.symbol === value);
                if (token) {
                  console.log("Setting selected token to:", token.symbol);
                  setSelectedToken(token);

                  // Notify parent component about token change if callback exists
                  if (onTokenChange) {
                    onTokenChange(token.symbol);
                  } else {
                    // If no callback provided, update URL directly
                    const params = new URLSearchParams(searchParams.toString());

                    if (token.symbol === "vDOT") {
                      params.set("token", "dot");
                    } else if (token.symbol === "vETH") {
                      params.set("token", "eth");
                    }

                    // Update the URL without refreshing the page
                    router.replace(`${pathname}?${params.toString()}`, {
                      scroll: false,
                    });
                  }
                }
              }}
              value={selectedToken?.symbol || ""}
            >
              <SelectTrigger
                id="token-selector"
                className="w-full text-lg py-4 border-2 focus:ring-2 focus:ring-primary"
              >
                {selectedToken ? (
                  <div className="flex items-center gap-3">
                    <TokenIcon symbol={selectedToken.symbol} size={28} />
                    <span className="font-semibold text-xl">
                      {selectedToken.symbol}
                    </span>
                  </div>
                ) : (
                  <SelectValue placeholder="Select a token to mint" />
                )}
              </SelectTrigger>
              <SelectContent className="w-full">
                {tokens.map((token) => (
                  <SelectItem
                    key={token.symbol}
                    value={token.symbol}
                    className=" hover:bg-muted cursor-pointer"
                  >
                    <div className="flex flex-row gap-3 items-center justify-start">
                      <TokenIcon symbol={token.symbol} size={28} />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {token.symbol}
                        </p>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2 rounded-lg border p-4">
            {selectedToken ? (
              <div>
                {/* A type-safe field component*/}
                <form.Field
                  name="amount"
                  validators={{
                    onChange: ({ value }) =>
                      !value
                        ? "Please enter an amount to mint"
                        : parseEther(value) < 0
                        ? "Amount must be greater than 0"
                        : parseEther(value) >
                          (selectedToken?.symbol === "vETH"
                            ? nativeBalance ?? BigInt(0)
                            : tokenBalances?.[0] ?? BigInt(0))
                        ? "Amount must be less than or equal to your balance"
                        : undefined,
                  }}
                >
                  {(field) => (
                    <div className="flex flex-col gap-2">
                      <div
                        id="amount-controls"
                        className="flex flex-row gap-2 items-center justify-between"
                      >
                        <p className="text-muted-foreground">Minting</p>
                        {selectedToken && (
                          <div className="flex flex-row gap-1">
                            <button
                              type="button"
                              onClick={() => {
                                const availableBalance =
                                  selectedToken?.symbol === "vETH"
                                    ? nativeBalance ?? BigInt(0)
                                    : tokenBalances?.[0] ?? BigInt(0);

                                const percentageAmount =
                                  (availableBalance * BigInt(25)) / BigInt(100);
                                field.handleChange(
                                  roundLongDecimals(
                                    formatEther(percentageAmount),
                                    6
                                  )
                                );
                              }}
                              className="bg-transparent border border-muted-foreground text-muted-foreground rounded-md px-2 py-0.5 hover:cursor-pointer hover:bg-muted/10"
                            >
                              25%
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const availableBalance =
                                  selectedToken?.symbol === "vETH"
                                    ? nativeBalance ?? BigInt(0)
                                    : tokenBalances?.[0] ?? BigInt(0);

                                const percentageAmount =
                                  (availableBalance * BigInt(50)) / BigInt(100);
                                field.handleChange(
                                  roundLongDecimals(
                                    formatEther(percentageAmount),
                                    6
                                  )
                                );
                              }}
                              className="bg-transparent border border-muted-foreground text-muted-foreground rounded-md px-2 py-0.5 hover:cursor-pointer hover:bg-muted/10"
                            >
                              50%
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const availableBalance =
                                  selectedToken?.symbol === "vETH"
                                    ? nativeBalance ?? BigInt(0)
                                    : tokenBalances?.[0] ?? BigInt(0);

                                const percentageAmount =
                                  (availableBalance * BigInt(75)) / BigInt(100);
                                field.handleChange(
                                  roundLongDecimals(
                                    formatEther(percentageAmount),
                                    6
                                  )
                                );
                              }}
                              className="bg-transparent border border-muted-foreground text-muted-foreground rounded-md px-2 py-0.5 hover:cursor-pointer hover:bg-muted/10"
                            >
                              75%
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const availableBalance =
                                  selectedToken?.symbol === "vETH"
                                    ? nativeBalance ?? BigInt(0)
                                    : tokenBalances?.[0] ?? BigInt(0);

                                // For max, leave a small amount for gas (if ETH)
                                const maxAmount =
                                  selectedToken?.symbol === "vETH"
                                    ? availableBalance > BigInt(1e16) // Leave 0.01 ETH for gas
                                      ? availableBalance - BigInt(1e16)
                                      : BigInt(0)
                                    : availableBalance;

                                field.handleChange(
                                  roundLongDecimals(formatEther(maxAmount), 6)
                                );
                              }}
                              className="bg-transparent border border-muted-foreground text-muted-foreground rounded-md px-2 py-0.5 hover:cursor-pointer hover:bg-muted/10"
                            >
                              Max
                            </button>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-row gap-2">
                        {isDesktop ? (
                          <input
                            id={field.name}
                            name={field.name}
                            value={field.state.value || ""}
                            onChange={(e) => field.handleChange(e.target.value)}
                            className="bg-transparent text-4xl outline-none w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            type="number"
                            placeholder="0"
                            required
                          />
                        ) : (
                          <input
                            id={field.name}
                            name={field.name}
                            value={field.state.value || ""}
                            onChange={(e) => field.handleChange(e.target.value)}
                            className="bg-transparent text-4xl outline-none w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            type="number"
                            inputMode="decimal"
                            pattern="[0-9]*"
                            placeholder="0"
                            required
                          />
                        )}
                        <p className="place-self-end text-lg text-muted-foreground">
                          {selectedToken?.symbol === "vETH"
                            ? "ETH"
                            : selectedToken?.symbol === "vDOT"
                            ? "DOT"
                            : "-"}
                        </p>
                      </div>
                      <div className="flex flex-row gap-2">
                        {selectedToken?.symbol === "vETH" ? (
                          <p className="text-muted-foreground">
                            {roundLongDecimals(
                              formatEther(nativeBalance ?? BigInt(0)),
                              6
                            )}{" "}
                            ETH
                          </p>
                        ) : selectedToken?.symbol === "vDOT" ? (
                          <p className="text-muted-foreground">
                            {roundLongDecimals(
                              formatEther(tokenBalances?.[0] ?? BigInt(0)),
                              6
                            )}{" "}
                            DOT
                          </p>
                        ) : (
                          <p className="text-muted-foreground">-</p>
                        )}
                      </div>
                      {/* Exchange ratio display */}
                      <div className="flex flex-col gap-1 mt-2 p-2 bg-muted/10 rounded-md">
                        <div className="flex justify-between items-center">
                          <p className="text-sm text-muted-foreground">
                            Exchange Ratio:
                          </p>
                          <p className="text-sm font-medium">
                            {isLoading ? (
                              <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
                            ) : (
                              `1 ${selectedToken?.symbol} = ${getExchangeRatio(
                                selectedToken?.symbol
                              )} ${selectedToken?.symbol.replace("v", "")}`
                            )}
                          </p>
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-sm text-muted-foreground">
                            You will receive:
                          </p>
                          <p className="text-sm font-medium">
                            {isLoading ? (
                              <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
                            ) : (
                              `${calculateExpectedAmount(
                                field.state.value || "0",
                                getExchangeRatio(selectedToken?.symbol)
                              )} ${selectedToken?.symbol}`
                            )}
                          </p>
                        </div>
                      </div>
                      <FieldInfo field={field} />
                    </div>
                  )}
                </form.Field>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <p className="text-muted-foreground">
                  Please select a token to mint
                </p>
              </div>
            )}
          </div>
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
          >
            {([canSubmit, isSubmitting]) => (
              <Button
                id="mint-button"
                size="lg"
                className="hover:cursor-pointer text-lg font-bold"
                type="submit"
                onClick={(e) => {
                  // Only submit when explicitly clicking the mint button
                  if (
                    !canSubmit ||
                    isSubmitting ||
                    isPending ||
                    isBatching ||
                    isSendingCalls
                  ) {
                    e.preventDefault();
                  }
                }}
                disabled={
                  !selectedToken ||
                  !canSubmit ||
                  isSubmitting ||
                  isPending ||
                  isBatching ||
                  isSendingCalls
                }
              >
                {isSubmitting || isPending || isBatching ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Please confirm in wallet
                  </>
                ) : isSendingCalls ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending...
                  </>
                ) : availableCapabilities?.[chainId]?.atomic?.status !==
                    "supported" &&
                  tokenAllowance === BigInt(0) &&
                  selectedToken?.symbol === "vDOT" ? (
                  <>Approve</>
                ) : (
                  <>Mint</>
                )}
              </Button>
            )}
          </form.Subscribe>
        </div>
      </form>
      <TransactionStatus
        hash={hash || batchCallsStatus?.receipts?.[0]?.transactionHash}
        isPending={isPending || isSendingCalls}
        isConfirming={isConfirming || isBatchCallsLoading}
        isConfirmed={isConfirmed || isBatchCallsSuccess}
        error={(error as BaseError) || (batchError as BaseError)}
        config={config}
        chainId={chainId}
        open={open}
        onOpenChange={setOpen}
      />
    </div>
  );
}

function FieldInfo({ field }: { field: AnyFieldApi }) {
  return (
    <>
      {!field.state.meta.isTouched ? (
        <em>Please enter an amount to mint</em>
      ) : field.state.meta.isTouched && !field.state.meta.isValid ? (
        <em
          className={`${
            field.state.meta.errors.join(",") ===
            "Please enter an amount to mint"
              ? ""
              : "text-red-500"
          }`}
        >
          {field.state.meta.errors.join(",")}
        </em>
      ) : (
        <em className="text-green-500">ok!</em>
      )}
      {field.state.meta.isValidating ? "Validating..." : null}
    </>
  );
}

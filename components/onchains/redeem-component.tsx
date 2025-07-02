"use client";

import { useEffect, useState } from "react";
import {
  type BaseError,
  useWaitForTransactionReceipt,
  useWriteContract,
  useReadContracts,
  useCapabilities,
  useSendCalls,
  useAccount,
  useChainId,
  useConfig,
  useWaitForCallsStatus,
  useCallsStatus,
} from "wagmi";
import { l2SlpxAbi } from "@/lib/abis";
import { L2SLPX_CONTRACT_ADDRESS } from "@/lib/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Token } from "@/types/token";
import Image from "next/image";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import { RedeemProps } from "@/types/shared";
import { roundLongDecimals } from "@/lib/utils";
import { formatEther, parseEther, erc20Abi, Address, maxUint256 } from "viem";
import { useForm } from "@tanstack/react-form";
import type { AnyFieldApi } from "@tanstack/react-form";
import { Loader2 } from "lucide-react";
import { TransactionStatus } from "@/components/onchains/transaction-status";
import { TOKEN_LIST } from "@/lib/constants";

// extract tokens for redeeming
const tokens: Token[] = TOKEN_LIST.filter(
  (token) => token.symbol == "ETH" || token.symbol == "DOT"
);

export default function RedeemComponent({
  tokenBalances,
  initialTokenSymbol,
  onTokenChange,
  nativeBalance,
}: RedeemProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [open, setOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const config = useConfig();
  const { address } = useAccount();
  const chainId = useChainId();
  const { data: availableCapabilities } = useCapabilities({
    account: address,
    chainId: chainId,
  });

  // Initialize with the initial token if provided
  useEffect(() => {
    if (initialTokenSymbol) {
      const token = tokens.find((token) => {
        if (initialTokenSymbol === "vETH") return token.symbol === "ETH";
        if (initialTokenSymbol === "vDOT") return token.symbol === "DOT";
        return false;
      });

      if (token) {
        setSelectedToken(token);
      }
    }
  }, [initialTokenSymbol]);

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

  const form = useForm({
    defaultValues: {
      amount: "",
    },
    onSubmit: async ({ value }) => {
      // write to contract if ETH
      if (selectedToken?.symbol === "ETH") {
        if (availableCapabilities?.[chainId]?.atomic?.status === "supported") {
          sendCalls({
            calls: [
              {
                to: TOKEN_LIST.filter((token) => token.symbol === "vETH")[0]
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
                  TOKEN_LIST.filter((token) => token.symbol === "vETH")[0]
                    .address as Address,
                  parseEther(value.amount),
                  1,
                  "bifrost",
                ],
              },
            ],
          });
        }

        if (
          availableCapabilities?.[chainId]?.atomic?.status !== "unsupported"
        ) {
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
            tokenAllowances?.[0]?.result >= parseEther(value.amount)
          ) {
            writeContract({
              address: L2SLPX_CONTRACT_ADDRESS,
              abi: l2SlpxAbi,
              functionName: "createOrder",
              args: [
                TOKEN_LIST.filter((token) => token.symbol === "vETH")[0]
                  .address as Address,
                parseEther(value.amount),
                1,
                "bifrost",
              ],
            });
          }
        }
      }

      // write to contract if vDOT
      if (selectedToken?.symbol === "DOT") {
        if (availableCapabilities?.[chainId]?.atomic?.status === "supported") {
          sendCalls({
            calls: [
              {
                to: TOKEN_LIST.filter((token) => token.symbol === "vDOT")[0]
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
                  TOKEN_LIST.filter((token) => token.symbol === "vDOT")[0]
                    .address as Address,
                  parseEther(value.amount),
                  1,
                  "bifrost",
                ],
              },
            ],
          });
        }

        if (availableCapabilities?.[chainId]?.atomic?.status !== "supported") {
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
            tokenAllowances?.[1]?.result >= parseEther(value.amount)
          ) {
            await writeContract({
              address: L2SLPX_CONTRACT_ADDRESS,
              abi: l2SlpxAbi,
              functionName: "createOrder",
              args: [
                TOKEN_LIST.filter((token) => token.symbol === "vDOT")[0]
                  .address as Address,
                parseEther(value.amount),
                1,
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
    if (isConfirmed) {
      refetchTokenAllowances();
    }
  }, [isConfirmed, refetchTokenAllowances]);

  useEffect(() => {
    if (isConfirming || isSendingCalls) {
      setOpen(true);
    }
  }, [isConfirming, isSendingCalls]);

  return (
    <div className="flex flex-col gap-4 w-full p-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Redeem</h1>
        <p className="text-muted-foreground">Redeem Liquid Staking Tokens</p>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <div className="flex flex-col gap-4">
          <div id="token-selector">
            <Select
              onValueChange={(value) => {
                const token = tokens.find((token) => token.symbol === value);
                if (token) {
                  setSelectedToken(token);
                  if (onTokenChange) {
                    if (token.symbol === "ETH") {
                      onTokenChange("vETH");
                    } else if (token.symbol === "DOT") {
                      onTokenChange("vDOT");
                    }
                  }
                }
              }}
              value={selectedToken?.symbol}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a token" />
              </SelectTrigger>
              <SelectContent>
                {tokens.map((token) => (
                  <SelectRedeemToken key={token.address} token={token} />
                ))}
              </SelectContent>
            </Select>
          </div>
          <div
            id="amount-controls"
            className="flex flex-col gap-2 rounded-lg border p-4"
          >
            <div>
              {/* A type-safe field component*/}
              <form.Field
                name="amount"
                validators={{
                  onChange: ({ value }) =>
                    !value
                      ? "Please enter an amount to redeem"
                      : parseEther(value) < 0
                      ? "Amount must be greater than 0"
                      : parseEther(value) >
                        (selectedToken?.symbol === "ETH"
                          ? tokenBalances?.[1] ?? BigInt(0)
                          : tokenBalances?.[2] ?? BigInt(0))
                      ? "Amount must be less than or equal to your balance"
                      : undefined,
                }}
              >
                {(field) => (
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-row items-center justify-between">
                      <p className="text-muted-foreground">Redeeming</p>
                      <button
                        type="button"
                        onClick={() =>
                          field.handleChange(
                            formatEther(
                              (selectedToken?.symbol === "ETH"
                                ? tokenBalances?.[1]
                                : selectedToken?.symbol === "DOT"
                                ? tokenBalances?.[2]
                                : BigInt(0)) ?? BigInt(0)
                            )
                          )
                        }
                        className="bg-transparent border border-muted-foreground text-muted-foreground rounded-md px-2 py-0.5 hover:cursor-pointer"
                      >
                        Max
                      </button>
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
                        {selectedToken?.symbol === "ETH" ? "vETH" : "vDOT"}
                      </p>
                    </div>
                    <div className="flex flex-row gap-2">
                      {selectedToken?.symbol === "ETH" ? (
                        <p className="text-muted-foreground">
                          {roundLongDecimals(
                            formatEther(
                              (tokenBalances?.[1] as bigint) || BigInt(0)
                            ),
                            6
                          )}{" "}
                          vETH
                        </p>
                      ) : selectedToken?.symbol === "DOT" ? (
                        <p className="text-muted-foreground">
                          {roundLongDecimals(
                            formatEther(
                              (tokenBalances?.[2] as bigint) || BigInt(0)
                            ),
                            6
                          )}{" "}
                          vDOT
                        </p>
                      ) : (
                        <p className="text-muted-foreground">0</p>
                      )}
                    </div>
                    <FieldInfo field={field} />
                  </div>
                )}
              </form.Field>
            </div>
          </div>
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
          >
            {([canSubmit, isSubmitting]) => (
              <Button
                id="mint-button"
                className="hover:cursor-pointer text-lg font-bold"
                type="submit"
                disabled={
                  !canSubmit || isPending || isBatching || isSendingCalls
                }
              >
                {isSubmitting || isPending || isBatching ? (
                  <>
                    <Loader2 />
                    Please confirm in wallet
                  </>
                ) : isSendingCalls ? (
                  <>
                    <Loader2 />
                    Sending...
                  </>
                ) : availableCapabilities?.[chainId]?.atomic?.status !==
                    "supported" &&
                  selectedToken?.symbol === "ETH" &&
                  tokenAllowances?.[0]?.status === "success" &&
                  tokenAllowances?.[0]?.result === BigInt(0) ? (
                  "Approve"
                ) : availableCapabilities?.[chainId]?.atomic?.status !==
                    "supported" &&
                  selectedToken?.symbol === "DOT" &&
                  tokenAllowances?.[1]?.status === "success" &&
                  tokenAllowances?.[1]?.result === BigInt(0) ? (
                  "Approve"
                ) : (
                  "Redeem"
                )}
              </Button>
            )}
          </form.Subscribe>
        </div>
      </form>
      <TransactionStatus
        hash={hash || batchCallsStatus?.receipts?.[0]?.transactionHash}
        isPending={isPending || isSendingCalls}
        isConfirming={isConfirming || isSendingCalls}
        isConfirmed={isConfirmed || isSendingCallsSuccess}
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
        <em>Please enter an amount to redeem</em>
      ) : field.state.meta.isTouched && !field.state.meta.isValid ? (
        <em
          className={`${
            field.state.meta.errors.join(",") ===
            "Please enter an amount to redeem"
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

function SelectRedeemToken({ token }: { token: Token }) {
  return (
    <SelectItem value={token.symbol}>
      <div className="flex flex-row items-center gap-2">
        <Image src={token.image} alt={token.symbol} width={30} height={30} />
        <p className="text-lg">{token.name}</p>
        <p className="text-lg text-muted-foreground">{token.symbol}</p>
      </div>
    </SelectItem>
  );
}

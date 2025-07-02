"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import React, { useState } from "react";

const coins = [
  {
    id: "ethereum",
    name: "Ethereum",
    symbol: "ETH",
    icon: "/eth.svg",
  },
  {
    id: "polkadot",
    name: "Polkadot",
    symbol: "DOT",
    icon: "/dot.svg",
  },
];

// Reusable CoinSelect component
const CoinSelect = ({
  value,
  onChange,
  className = "",
  label = "Coin",
}: {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  label?: string;
}) => {
  const currentCoin = coins.find((coin) => coin.id === value) || coins[0];

  return (
    <div className="space-y-2">
      <Label
        htmlFor="coin-select"
        className="text-sm font-medium text-gray-700"
      >
        {label}
      </Label>
      <Select defaultValue={value} onValueChange={onChange}>
        <SelectTrigger className={`w-full h-12 px-4 ${className}`}>
          <div className="flex items-center gap-3">
            <SelectValue placeholder="Select coin" />
          </div>
        </SelectTrigger>
        <SelectContent>
          {coins.map((coin) => (
            <SelectItem key={coin.id} value={coin.id}>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full flex items-center justify-center">
                  <Image
                    src={coin.icon}
                    alt={coin.name}
                    width={24}
                    height={24}
                  />
                </div>
                {coin.name}/{coin.symbol}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default function Trading() {
  const [buyAmountBTC, setBuyAmountBTC] = useState("0.0000005");
  const [buyAmountUSD, setBuyAmountUSD] = useState("0.0000005");
  const [sellAmountBTC, setSellAmountBTC] = useState("0.0000005");
  const [sellAmountUSD, setSellAmountUSD] = useState("0.0000005");
  const [selectedCoin, setSelectedCoin] = useState("ethereum");

  // Find the selected coin object
  const currentCoin =
    coins.find((coin) => coin.id === selectedCoin) || coins[0];

  return (
    <Card className="flex flex-1 flex-col gap-3 p-4 relative overflow-hidden h-full">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-md font-medium">Trading</h1>
        <p className=" text-3xl font-bold">$46,200</p>
      </div>
      {/* Content */}
      <Tabs defaultValue="buy" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="buy" className="flex-1">
            Buy
          </TabsTrigger>
          <TabsTrigger value="sell" className="flex-1">
            Sell
          </TabsTrigger>
        </TabsList>

        <TabsContent value="buy" className="space-y-6 mt-6">
          <CoinSelect value={selectedCoin} onChange={setSelectedCoin} />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="amount-btc"
                className="text-sm font-medium text-gray-700"
              >
                Amount ({currentCoin.symbol})
              </Label>
              <Input
                id="amount-btc"
                type="text"
                value={buyAmountBTC}
                onChange={(e) => setBuyAmountBTC(e.target.value)}
                placeholder="0.0000005"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="amount-usd"
                className="text-sm font-medium text-gray-700"
              >
                Amount (USDT)
              </Label>
              <Input
                id="amount-usd"
                type="text"
                value={buyAmountUSD}
                onChange={(e) => setBuyAmountUSD(e.target.value)}
                placeholder="0.0000005"
              />
            </div>
          </div>

          <Button className="w-full">Make Payment</Button>
        </TabsContent>

        <TabsContent value="sell" className="space-y-6 mt-6">
          <CoinSelect
            value={selectedCoin}
            onChange={setSelectedCoin}
            className="bg-gray-50 border border-gray-200 rounded-lg"
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="sell-amount-btc"
                className="text-sm font-medium text-gray-700"
              >
                Amount ({currentCoin.symbol})
              </Label>
              <Input
                id="sell-amount-btc"
                type="text"
                value={sellAmountBTC}
                onChange={(e) => setSellAmountBTC(e.target.value)}
                placeholder="0.0000005"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="sell-amount-usd"
                className="text-sm font-medium text-gray-700"
              >
                Amount (USD)
              </Label>
              <Input
                id="sell-amount-usd"
                type="text"
                value={sellAmountUSD}
                onChange={(e) => setSellAmountUSD(e.target.value)}
                placeholder="0.0000005"
              />
            </div>
          </div>

          <Button className="w-full">Sell Crypto</Button>
        </TabsContent>
      </Tabs>
    </Card>
  );
}

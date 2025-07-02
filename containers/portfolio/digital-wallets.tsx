import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import React from "react";

export default function DigitalWallets() {
  return (
    <Card className="flex flex-1 flex-col gap-3 p-4 relative overflow-hidden h-full">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Digital Wallets</h1>
        <Button variant="outline" size="icon">
          <ChevronRight className="size-4" />
        </Button>
      </div>
      {/* Content */}
      <div className="flex flex-col gap-2">
        <Card className="flex flex-col gap-2 p-4">
          <div className="flex gap-2">
            <Image
              src="/eth.svg"
              alt="Ethereum Wallet"
              width={24}
              height={24}
            />
            <h2 className="text-md ">Ethereum Wallet</h2>
          </div>
          <div className="flex gap-2">
            <h2 className="text-md ">4.620910</h2>
            <Badge variant="outline">
              <span className="text-xs">ETH</span>
            </Badge>
          </div>
        </Card>
        <Card className="flex flex-col gap-2 p-4">
          <div className="flex gap-2">
            <Image
              src="/dot.svg"
              alt="Ethereum Wallet"
              width={24}
              height={24}
            />
            <h2 className="text-md ">Polkadot Wallet</h2>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline">
              <span className="text-xs">Coming Soon</span>
            </Badge>
          </div>
        </Card>
      </div>
    </Card>
  );
}

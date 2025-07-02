"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

// Mock data for recent activities
const recentActivities = [
  {
    id: 1,
    coin: "Ethereum",
    icon: "/eth.svg",
    type: "Buy",
    date: "Nov 28, 2024 11:34 PM",
    amountBTC: "0.5384",
    amountUSD: "3980.93",
    badgeColor: "bg-orange-100 text-orange-600 hover:bg-orange-100",
  },
  {
    id: 2,
    coin: "Polkadot",
    icon: "/dot.svg",
    type: "Sell",
    date: "Nov 10, 2024 11:34 PM",
    amountBTC: "0.5384",
    amountUSD: "3980.93",
    badgeColor: "bg-blue-100 text-blue-600 hover:bg-blue-100",
  },
  {
    id: 3,
    coin: "Ethereum",
    icon: "/eth.svg",
    type: "Send",
    date: "Sept 04, 2024 11:34 PM",
    amountBTC: "0.5384",
    amountUSD: "3980.93",
    badgeColor: "bg-green-100 text-green-600 hover:bg-green-100",
  },
  {
    id: 4,
    coin: "Polkadot",
    icon: "/dot.svg",
    type: "Buy",
    date: "Nov 12, 2024 11:34 PM",
    amountBTC: "0.5384",
    amountUSD: "3980.93",
    badgeColor: "bg-orange-100 text-orange-600 hover:bg-orange-100",
  },
  {
    id: 5,
    coin: "Polkadot",
    icon: "/dot.svg",
    type: "Buy",
    date: "Nov 12, 2024 11:35 PM",
    amountBTC: "0.5384",
    amountUSD: "3980.93",
    badgeColor: "bg-orange-100 text-orange-600 hover:bg-orange-100",
  },
  {
    id: 6,
    coin: "Polkadot",
    icon: "/dot.svg",
    type: "Buy",
    date: "Nov 12, 2024 11:38 PM",
    amountBTC: "0.5384",
    amountUSD: "3980.93",
    badgeColor: "bg-orange-100 text-orange-600 hover:bg-orange-100",
  },
];

export default function RecentActivities() {
  return (
    <Card className="p-4 flex flex-col gap-6 h-full">
      <h2 className="text-md font-bold">Recent Activities</h2>

      <div className="flex flex-col gap-6">
        {recentActivities.map((activity) => (
          <div key={activity.id} className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center p-2">
                <Image
                  src={activity.icon}
                  alt={activity.coin}
                  width={32}
                  height={32}
                />
              </div>
              <div>
                <div className="flex flex-col lg:flex-row items-start gap-3 text-xs lg:text-sm">
                  <span className="text-lg font-medium">{activity.coin}</span>
                  <Badge className={activity.badgeColor}>{activity.type}</Badge>
                </div>
                <p className="text-muted-foreground">{activity.date}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-medium">{activity.amountBTC} BTC</p>
              <p className="text-muted-foreground">{activity.amountUSD} USD</p>
            </div>
          </div>
        ))}
      </div>

      <Button variant="outline" className="w-full mt-2">
        View All
      </Button>
    </Card>
  );
}

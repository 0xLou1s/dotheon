import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowUpRight } from "lucide-react";

export default function Overview() {
  const MockData = [
    {
      title: "Transactions",
      value: 150,
      description: "Transactions",
    },
    {
      title: "Wallets",
      value: 1,
      description: "Wallets",
    },
  ];

  return (
    <Card className="flex flex-1 flex-col gap-3 p-4 relative overflow-hidden h-full">
      <h1 className="text-2xl font-extrabold">Overview</h1>
      <div className="size-full bg-primary opacity-40 inset-0 absolute"></div>
      <Card className="flex flex-col gap-8 p-4 h-full w-full relative">
        {/* Header */}
        <div className="flex gap-4 justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold">{MockData[0].value}</h2>
            <p className="text-muted-foreground">{MockData[0].description}</p>
          </div>
          <div className="flex flex-col gap-2 p-2 justify-center items-center rounded-lg bg-accent/65">
            <h2 className="text-3xl font-extrabold text-muted-foreground">
              {MockData[1].value}
            </h2>
            <p className="text-muted-foreground">{MockData[1].description}</p>
          </div>
        </div>
        {/* Content */}
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-bold">$998,70</h2>
          <p className="text-muted-foreground">Total Balance</p>
        </div>

        <Separator />

        <div className="flex gap-2 items-center justify-between">
          <div className="flex gap-2 items-center">
            <span className="text-xl font-bold">4,620,910</span>
            <span className="text-muted-foreground">USDT</span>
            <Badge
              variant="outline"
              className="p-1 bg-green-100 text-green-600 dark:bg-green-900"
            >
              <ArrowUpRight className="size-4" />
              <span className="text-xs">+10.2%</span>
            </Badge>
          </div>
          <Button>
            <span className="sr-only">View More</span>
            <ArrowUpRight className="size-4" />
          </Button>
        </div>
      </Card>
    </Card>
  );
}

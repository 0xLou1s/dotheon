import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";

const glossaryItems = [
  {
    term: "APY",
    definition:
      "Annual Percentage Yield - The rate of return earned on an investment, including compound interest.",
    category: "general",
  },
  {
    term: "Bifrost",
    definition:
      "A DeFi protocol on Polkadot that provides liquid staking services and other DeFi products.",
    category: "protocol",
  },
  {
    term: "DeFi",
    definition:
      "Decentralized Finance - A financial system that operates without intermediaries.",
    category: "general",
  },
  {
    term: "DOT",
    definition: "The native token of the Polkadot network.",
    category: "token",
  },
  {
    term: "KSM",
    definition:
      "The native token of the Kusama network, Polkadot's canary network.",
    category: "token",
  },
  {
    term: "Liquid Staking",
    definition:
      "A staking method that allows users to receive representative tokens that can be traded while still earning staking rewards.",
    category: "general",
  },
  {
    term: "SLP",
    definition:
      "Staking Liquidity Protocol - Bifrost's staking liquidity protocol.",
    category: "protocol",
  },
  {
    term: "Staking",
    definition:
      "The process of locking up cryptocurrency to support a blockchain network's operations and earn rewards.",
    category: "general",
  },
  {
    term: "vDOT",
    definition:
      "A token representing staked DOT on Bifrost, which can be traded and used in other DeFi applications.",
    category: "token",
  },
  {
    term: "vKSM",
    definition:
      "A token representing staked KSM on Bifrost, which can be traded and used in other DeFi applications.",
    category: "token",
  },
  {
    term: "vsBond",
    definition:
      "Voucher Slot Bond - A token representing a parachain slot auction, allowing users to reclaim their original tokens before the slot lease ends.",
    category: "token",
  },
  {
    term: "Yield",
    definition:
      "The profit or rewards earned from investing or staking cryptocurrency.",
    category: "general",
  },
];

export default function GlossaryPage() {
  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between border-b px-6 py-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Glossary</h1>
          <p className="text-muted-foreground">
            Essential DeFi and Bifrost terminology
          </p>
        </div>
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search terms" className="pl-8" />
        </div>
      </div>
      <div className="flex-1 space-y-6 p-6">
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="protocol">Protocol</TabsTrigger>
            <TabsTrigger value="token">Token</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {glossaryItems.map((item) => (
                <Card key={item.term}>
                  <CardHeader className="pb-2">
                    <CardTitle>{item.term}</CardTitle>
                    <CardDescription>
                      {item.category === "general" && "General term"}
                      {item.category === "protocol" && "Protocol"}
                      {item.category === "token" && "Token"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>{item.definition}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="general" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {glossaryItems
                .filter((item) => item.category === "general")
                .map((item) => (
                  <Card key={item.term}>
                    <CardHeader className="pb-2">
                      <CardTitle>{item.term}</CardTitle>
                      <CardDescription>General term</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>{item.definition}</p>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
          <TabsContent value="protocol" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {glossaryItems
                .filter((item) => item.category === "protocol")
                .map((item) => (
                  <Card key={item.term}>
                    <CardHeader className="pb-2">
                      <CardTitle>{item.term}</CardTitle>
                      <CardDescription>Protocol</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>{item.definition}</p>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
          <TabsContent value="token" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {glossaryItems
                .filter((item) => item.category === "token")
                .map((item) => (
                  <Card key={item.term}>
                    <CardHeader className="pb-2">
                      <CardTitle>{item.term}</CardTitle>
                      <CardDescription>Token</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>{item.definition}</p>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

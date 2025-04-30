import { AlertTriangle, ExternalLink, Info, ShieldAlert } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const generalRisks = [
  {
    title: "Market Risk",
    description: "Price volatility can affect asset value",
    content:
      "Cryptocurrency prices can be highly volatile. This can affect the value of assets you are staking or providing as liquidity.",
    mitigation: [
      "Only invest what you can afford to lose",
      "Diversify your portfolio",
      "Monitor the market regularly",
    ],
  },
  {
    title: "Liquidity Risk",
    description: "Difficulty withdrawing assets",
    content:
      "In some cases, you may face difficulties withdrawing your assets due to lack of liquidity in the market or protocol restrictions.",
    mitigation: [
      "Understand the withdrawal mechanisms of the protocol",
      "Check liquidity before participating",
      "Don't invest all your assets in one protocol",
    ],
  },
  {
    title: "Regulatory Risk",
    description: "Regulatory changes can affect DeFi",
    content:
      "Cryptocurrency and DeFi regulations are evolving. Regulatory changes can affect how DeFi protocols operate.",
    mitigation: [
      "Stay updated on regulatory news",
      "Comply with regulations in your jurisdiction",
      "Diversify your portfolio",
    ],
  },
  {
    title: "Technical Risk",
    description: "Technical issues can lead to asset loss",
    content:
      "DeFi protocols can experience technical issues, hacks, or security vulnerabilities. This can lead to loss of assets.",
    mitigation: [
      "Use audited protocols",
      "Follow security news",
      "Start with small amounts",
    ],
  },
];

const protocolRisks = [
  {
    title: "Slashing Risk",
    content:
      "When staking DOT through Bifrost, there is a slashing risk if the validator chosen by Bifrost violates network rules. This can lead to loss of a portion of staked assets.",
  },
  {
    title: "Peg Risk",
    content:
      "vTokens (like vDOT, vKSM) can lose their peg to the original token in some cases, affecting the value of vTokens.",
  },
  {
    title: "Unbonding Risk",
    content:
      "When you want to unstake DOT from Bifrost, there may be an unbonding period (28 days for DOT). During this time, you don't receive rewards and can't use your assets.",
  },
];

const securityTips = [
  {
    title: "Wallet Security",
    content:
      "Protecting your wallet is the first step to protect your assets. Use a secure wallet, protect your seed phrase, and never share your wallet information with others.",
    tips: [
      "Use a hardware wallet for large amounts",
      "Don't store your seed phrase on electronic devices",
      "Enable two-factor authentication if available",
    ],
  },
  {
    title: "Scam Prevention",
    content:
      "Be cautious of scam attempts such as phishing, fake websites, and unclear transfer requests.",
    tips: [
      "Check URLs before entering wallet information",
      "Don't click on suspicious links",
      "Never share your seed phrase with anyone",
    ],
  },
  {
    title: "Transaction Verification",
    content:
      "Always carefully check transaction details before confirming. Make sure the address, amount, and other parameters are correct.",
    tips: [
      "Check the recipient address before sending",
      "Start with small amounts to test",
      "Understand transaction fees and slippage",
    ],
  },
];

export default function RisksPage() {
  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between border-b px-6 py-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Risks & Warnings
          </h1>
          <p className="text-muted-foreground">
            Information about risks when using DeFi
          </p>
        </div>
        <Button variant="outline">
          <ExternalLink className="mr-2 h-4 w-4" />
          Learn more
        </Button>
      </div>
      <div className="flex-1 space-y-6 p-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Warning</AlertTitle>
          <AlertDescription>
            DeFi carries high risks. Make sure you understand the risks before
            participating.
          </AlertDescription>
        </Alert>
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList>
            <TabsTrigger value="general">General Risks</TabsTrigger>
            <TabsTrigger value="protocol">Protocol Risks</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>
          <TabsContent value="general" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {generalRisks.map((risk) => (
                <Card key={risk.title}>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2">
                      <ShieldAlert className="h-5 w-5 text-destructive" />
                      <span>{risk.title}</span>
                    </CardTitle>
                    <CardDescription>{risk.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{risk.content}</p>
                    <div className="mt-4 bg-muted p-3">
                      <h4 className="text-sm font-medium">How to mitigate:</h4>
                      <ul className="mt-2 space-y-1 text-sm">
                        {risk.mitigation.map((item) => (
                          <li key={item}>• {item}</li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="protocol" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Bifrost Protocol Risks</CardTitle>
                <CardDescription>
                  Specific risks when using Bifrost
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {protocolRisks.map((risk) => (
                  <div key={risk.title} className="border p-4">
                    <h3 className="flex items-center gap-2 font-medium">
                      <Info className="h-5 w-5 text-blue-500" />
                      <span>{risk.title}</span>
                    </h3>
                    <p className="mt-2 text-sm">{risk.content}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Asset Security</CardTitle>
                <CardDescription>
                  Security measures when using DeFi
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {securityTips.map((tip) => (
                  <div key={tip.title} className="border p-4">
                    <h3 className="flex items-center gap-2 font-medium">
                      <ShieldAlert className="h-5 w-5 text-green-500" />
                      <span>{tip.title}</span>
                    </h3>
                    <p className="mt-2 text-sm">{tip.content}</p>
                    <div className="mt-4 bg-muted p-3">
                      <h4 className="text-sm font-medium">Tips:</h4>
                      <ul className="mt-2 space-y-1 text-sm">
                        {tip.tips.map((item) => (
                          <li key={item}>• {item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

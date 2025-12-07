"use client";

import WalletInfo from "@/components/wallet-info";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWallet } from "@/hooks/use-wallet";
import NetworkSelector from "@/components/network-selector";

export default function WalletPage() {
  const { wallet, walletType } = useWallet();

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Wallet</h1>
        <p className="text-muted-foreground">
          Connect your wallet to interact with Dotheon. We support both EVM and
          Polkadot wallets.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <WalletInfo />

          {wallet && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Network Selection</CardTitle>
                <CardDescription>
                  Switch between available networks for your wallet
                </CardDescription>
              </CardHeader>
              <CardContent>
                <NetworkSelector />
              </CardContent>
            </Card>
          )}
        </div>

        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Wallet Features</CardTitle>
              <CardDescription>
                Explore the features available for your connected wallet
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!wallet ? (
                <div className="flex flex-col items-center justify-center py-10 space-y-4">
                  <p className="text-muted-foreground text-center">
                    Connect your wallet to access features
                  </p>
                </div>
              ) : (
                <Tabs defaultValue={walletType || "evm"}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="evm" disabled={walletType !== "evm"}>
                      EVM Features
                    </TabsTrigger>
                    <TabsTrigger
                      value="substrate"
                      disabled={walletType !== "substrate"}
                    >
                      Polkadot Features
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="evm" className="py-4">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">
                        EVM Wallet Connected
                      </h3>
                      <p className="text-muted-foreground">
                        You can now use EVM-based features such as minting
                        vTokens, redeeming tokens, and interacting with Bifrost
                        smart contracts.
                      </p>
                      <div className="grid grid-cols-2 gap-4 pt-4">
                        <Button variant="outline" className="w-full">
                          Mint vTokens
                        </Button>
                        <Button variant="outline" className="w-full">
                          Redeem Tokens
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="substrate" className="py-4">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">
                        Polkadot Wallet Connected
                      </h3>
                      <p className="text-muted-foreground">
                        You can now use Polkadot-based features such as staking
                        DOT, participating in governance, and interacting with
                        Bifrost parachains.
                      </p>
                      <div className="grid grid-cols-2 gap-4 pt-4">
                        <Button variant="outline" className="w-full">
                          Stake DOT
                        </Button>
                        <Button variant="outline" className="w-full">
                          Governance
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

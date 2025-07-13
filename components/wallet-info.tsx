import { useWallet } from "@/hooks/use-wallet";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatBalance } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";

export default function WalletInfo() {
  const {
    wallet,
    account,
    walletType,
    chainInfo,
    balance,
    isLoading,
    connecting,
    connectWallet,
    disconnectWallet,
    connectedChain,
    chains,
  } = useWallet();
  const [networkName, setNetworkName] = useState("Unknown");
  const [networkToken, setNetworkToken] = useState("");

  // Update network information when connected chain changes
  useEffect(() => {
    if (!connectedChain || !chains) {
      setNetworkName("Unknown");
      setNetworkToken("");
      return;
    }

    // Find the matching chain in the chains array
    const matchingChain = chains.find(
      (chain) =>
        chain.id === connectedChain.id &&
        chain.namespace === connectedChain.namespace
    );

    if (matchingChain) {
      console.log("WalletInfo - Found matching chain:", matchingChain);
      if (matchingChain.label) {
        setNetworkName(matchingChain.label);
      } else {
        setNetworkName("Unknown");
      }

      if (matchingChain.token) {
        setNetworkToken(matchingChain.token);
      } else {
        setNetworkToken("");
      }
    } else {
      console.log(
        "WalletInfo - No matching chain found for:",
        connectedChain.id
      );
      setNetworkName("Unknown");
      setNetworkToken("");
    }
  }, [connectedChain, chains]);

  if (!wallet || !account) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Wallet</CardTitle>
          <CardDescription>Connect your wallet to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={connectWallet}
            disabled={connecting}
            className="w-full"
          >
            {connecting ? "Connecting..." : "Connect Wallet"}
          </Button>
        </CardContent>
      </Card>
    );
  }

  const formatAddress = (address: string) => {
    if (address.length <= 12) return address;
    return `${address.slice(0, 6)}...${address.slice(-6)}`;
  };

  const getWalletTypeLabel = () => {
    if (!walletType) return "Unknown";
    return walletType === "substrate" ? "Polkadot" : "EVM";
  };

  const getFormattedBalance = () => {
    if (isLoading) {
      return <Skeleton className="h-6 w-24" />;
    }

    if (!balance || !chainInfo?.decimals) {
      return "N/A";
    }

    return formatBalance(balance, chainInfo.decimals, chainInfo.token);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Connected Wallet</CardTitle>
          <Badge variant={walletType === "substrate" ? "secondary" : "default"}>
            {getWalletTypeLabel()}
          </Badge>
        </div>
        <CardDescription>{wallet.label}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-1">
            Network
          </h3>
          <div className="flex items-center gap-2">
            {networkToken && (
              <img
                src={`/coins/${networkToken.toLowerCase()}.svg`}
                alt={networkName}
                className="w-5 h-5"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            )}
            <p className="font-medium">{networkName}</p>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-1">
            Address
          </h3>
          <p className="font-medium break-all">{account.address}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {account.name && `Name: ${account.name}`}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-1">
            Balance
          </h3>
          <div className="font-medium">{getFormattedBalance()}</div>
        </div>

        <Button
          variant="destructive"
          onClick={disconnectWallet}
          className="w-full"
        >
          Disconnect
        </Button>
      </CardContent>
    </Card>
  );
}

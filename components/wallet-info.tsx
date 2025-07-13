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
  } = useWallet();

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
        <CardTitle>Connected Wallet</CardTitle>
        <CardDescription>
          {wallet.label} ({getWalletTypeLabel()})
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-1">
            Network
          </h3>
          <p className="font-medium">{connectedChain?.label || "Unknown"}</p>
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
          <p className="font-medium">{getFormattedBalance()}</p>
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

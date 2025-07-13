import { Button } from "@/components/ui/button";
import { IconChevronDown } from "@tabler/icons-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useWallet } from "@/hooks/use-wallet";

export default function ConnectWalletBtn() {
  const {
    wallet,
    account,
    walletType,
    connecting,
    connectWallet,
    disconnectWallet,
    connectedChain,
  } = useWallet();
  const [isOpen, setIsOpen] = useState(false);

  const handleConnect = () => {
    connectWallet();
  };

  const handleDisconnect = () => {
    disconnectWallet();
    setIsOpen(false);
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getWalletType = () => {
    if (!walletType) return "";
    return walletType === "substrate" ? "Polkadot" : "EVM";
  };

  const connected = !!wallet && !!account;

  return (
    <div>
      {!connected ? (
        <Button
          id="wallet-connect-button"
          onClick={handleConnect}
          variant="default"
          disabled={connecting}
        >
          {connecting ? "Connecting..." : "Connect Wallet"}
        </Button>
      ) : (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="default">
              {account ? formatAddress(account.address) : "Connected"}
              <IconChevronDown className="size-4 ml-2" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <div className="flex flex-col gap-4 p-2">
              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground">
                  Wallet Type
                </span>
                <span className="font-medium">{getWalletType()}</span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground">
                  Connected Wallet
                </span>
                <span className="font-medium">{wallet?.label}</span>
              </div>

              {connectedChain && (
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-muted-foreground">Network</span>
                  <span className="font-medium">{connectedChain.label}</span>
                </div>
              )}

              {account && (
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-muted-foreground">Address</span>
                  <span className="font-medium break-all">
                    {account.address}
                  </span>
                </div>
              )}

              <Button variant="destructive" onClick={handleDisconnect}>
                Disconnect
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

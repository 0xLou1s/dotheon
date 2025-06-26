import { Button } from "@/components/ui/button";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { IconChevronDown } from "@tabler/icons-react";

export default function ConnectWalletBtn() {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        const ready = mounted;
        const connected = ready && account && chain;

        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <Button
                    id="wallet-connect-button"
                    onClick={openConnectModal}
                    variant="default"
                  >
                    Connect Wallet
                  </Button>
                );
              }

              if (chain.unsupported) {
                return (
                  <Button onClick={openChainModal} variant="destructive">
                    Wrong network
                  </Button>
                );
              }

              return (
                <div className="flex items-center gap-2">
                  <Button onClick={openChainModal} variant="default">
                    {chain.name && chain.name.length > 10
                      ? `${chain.name.slice(0, 5)}..${chain.name.slice(-5)}`
                      : chain.name}
                    <IconChevronDown className="size-4" />
                  </Button>

                  <Button onClick={openAccountModal} variant="default">
                    {/* <img src={account.ensAvatar} alt='' /> */}
                    {account.displayName}
                  </Button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}

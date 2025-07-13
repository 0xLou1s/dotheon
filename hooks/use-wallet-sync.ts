import { useEffect } from "react";
import { useConnectWallet } from "@subwallet-connect/react";
import { useDisconnect } from "wagmi";

export function useWalletSync() {
  const [{ wallet }] = useConnectWallet();
  const { disconnectAsync: wagmiDisconnect } = useDisconnect();

  useEffect(() => {
    if (!wallet) {
      // When SubWallet is disconnected, also disconnect Wagmi
      wagmiDisconnect().catch(console.error);
    }
  }, [wallet, wagmiDisconnect]);

  return null;
} 
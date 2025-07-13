import { useConnectWallet, useSetChain } from '@subwallet-connect/react';
import { useEffect, useState } from 'react';
import { SubstrateApi, POLKADOT_NETWORKS } from '@/lib/substrate-api';
// @ts-ignore
import { Account } from '@subwallet-connect/core/dist/types';
import { toast } from "sonner";

type WalletType = 'evm' | 'substrate' | null;
type ChainInfo = {
  id: string;
  name: string;
  token: string;
  decimals: number;
};

export function useWallet() {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();
  const [{ chains, connectedChain }, setChain] = useSetChain();
  const [substrateApi, setSubstrateApi] = useState<SubstrateApi | null>(null);
  const [walletType, setWalletType] = useState<WalletType>(null);
  const [account, setAccount] = useState<Account | null>(null);
  const [chainInfo, setChainInfo] = useState<ChainInfo | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Log wallet and chain information for debugging
  useEffect(() => {
    if (wallet) {
      console.log("Connected wallet:", wallet);
      console.log("Wallet type:", wallet.type);
      console.log("Wallet accounts:", wallet.accounts);
    }
    
    if (connectedChain) {
      console.log("Connected chain:", connectedChain);
    }
    
    if (chains && chains.length > 0) {
      console.log("Available chains:", chains);
    }
  }, [wallet, connectedChain, chains]);

  // Set wallet type and account when wallet changes
  useEffect(() => {
    if (!wallet) {
      setWalletType(null);
      setAccount(null);
      setChainInfo(null);
      setBalance(null);
      setSubstrateApi(null);
      return;
    }

    const type = wallet.type as WalletType;
    setWalletType(type);

    if (wallet.accounts && wallet.accounts.length > 0) {
      setAccount(wallet.accounts[0]);
    } else {
      setAccount(null);
    }

    // Clean up SubstrateAPI when wallet disconnects or changes
    return () => {
      if (substrateApi) {
        substrateApi.disconnect().catch(console.error);
      }
    };
  }, [wallet]);

  // Update chain info when connected chain changes
  useEffect(() => {
    if (!wallet || !connectedChain) return;

    console.log("Updating chain info for:", connectedChain.id);
    
    // Find the chain in the chains array
    const currentChain = chains.find(
      (chain) => chain.id === connectedChain.id && chain.namespace === connectedChain.namespace
    );

    if (currentChain) {
      console.log("Found matching chain:", currentChain);
      
      if (wallet.type === 'substrate') {
        // For Substrate wallets, initialize the API
        const chainLabel = currentChain.label;
        console.log("Substrate chain label:", chainLabel);
        
        const networkInfo = POLKADOT_NETWORKS[chainLabel as keyof typeof POLKADOT_NETWORKS];
        
        if (networkInfo) {
          console.log("Found network info:", networkInfo);
          const api = new SubstrateApi(networkInfo.wsProvider);
          setSubstrateApi(api);

          // Fetch chain info from the API
          api.getChainInfo().then((info) => {
            console.log("API chain info:", info);
            setChainInfo({
              id: connectedChain.id,
              name: info.name,
              token: info.tokenSymbol,
              decimals: info.tokenDecimals
            });
          }).catch(console.error);
        } else {
          // Use the chain info from the chains array if network info is not available
          console.log("No network info found, using chain info from chains array");
          setChainInfo({
            id: currentChain.id,
            name: currentChain.label as any,
            token: currentChain.token as any,
            decimals: currentChain.decimal || 18
          });
        }
      } else {
        // For EVM wallets, use the chain info directly
        console.log("Using EVM chain info directly");
        setChainInfo({
          id: currentChain.id,
          name: currentChain.label as any,
          token: currentChain.token as any,
          decimals: currentChain.decimal || 18
        });
      }
    } else {
      console.warn("No matching chain found for:", connectedChain.id);
    }
  }, [wallet, connectedChain, chains]);

  // Fetch balance when account or chain changes
  useEffect(() => {
    if (!account || !chainInfo) {
      setBalance(null);
      return;
    }

    const fetchBalance = async () => {
      setIsLoading(true);
      try {
        if (walletType === 'substrate' && substrateApi) {
          const balanceInfo = await substrateApi.getBalance(account.address);
          console.log("Substrate balance:", balanceInfo);
          setBalance(balanceInfo.total);
        } else if (walletType === 'evm' && wallet?.provider) {
          // For EVM wallets, we would use ethers.js or similar to fetch balance
          // This is a placeholder - actual implementation would depend on your EVM setup
          const provider = wallet.provider;
          console.log("EVM provider:", provider);
          // const balance = await provider.request({ method: 'eth_getBalance', params: [account.address, 'latest'] });
          // setBalance(balance);
        }
      } catch (error) {
        console.error('Error fetching balance:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBalance();
  }, [account, walletType, substrateApi, wallet, chainInfo]);

  // Handle wallet connection
  const connectWallet = async () => {
    try {
      await connect();
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  // Handle wallet disconnection
  const disconnectWallet = async () => {
    if (!wallet) return;
    
    try {
      await disconnect({ label: wallet.label, type: wallet.type });
      
      if (substrateApi) {
        await substrateApi.disconnect();
        setSubstrateApi(null);
      }
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
  };

  // Switch chain for the connected wallet
  const switchChain = async (chainId: string) => {
    if (!wallet) return;
    
    console.log("Switching to chain:", chainId);
    try {
      // Find the chain in the available chains
      const targetChain = chains.find(chain => chain.id === chainId);
      
      if (!targetChain) {
        console.error(`Chain with ID ${chainId} not found in available chains`);
        return;
      }
      
      console.log("Target chain details:", targetChain);
      
      // Pass both chainId and chainNamespace to ensure proper chain switching
      await setChain({ 
        chainId,
        chainNamespace: targetChain.namespace 
      });
      
      console.log("Chain switched successfully");
      toast.success("Network switched successfully");
    } catch (error) {
      console.error('Error switching chain:', error);
      toast.error("Failed to switch network");
    }
  };

  return {
    wallet,
    account,
    walletType,
    chainInfo,
    balance,
    isLoading,
    connecting,
    chains,
    connectedChain,
    connectWallet,
    disconnectWallet,
    switchChain,
    substrateApi
  };
} 
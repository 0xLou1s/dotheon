import { useConnectWallet, useSetChain } from '@subwallet-connect/react';
import { useEffect, useState } from 'react';
import { SubstrateApi, POLKADOT_NETWORKS } from '@/lib/substrate-api';
import { Account } from '@subwallet-connect/core/dist/types';

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

  // Initialize SubstrateAPI for Polkadot wallets
  useEffect(() => {
    if (walletType !== 'substrate' || !wallet || !connectedChain) return;

    const chainLabel = connectedChain.label;
    const networkInfo = POLKADOT_NETWORKS[chainLabel as keyof typeof POLKADOT_NETWORKS];
    
    if (networkInfo) {
      const api = new SubstrateApi(networkInfo.wsProvider);
      setSubstrateApi(api);

      // Fetch chain info
      api.getChainInfo().then((info) => {
        setChainInfo({
          id: connectedChain.id,
          name: info.name,
          token: info.tokenSymbol,
          decimals: info.tokenDecimals
        });
      }).catch(console.error);
    }
  }, [walletType, wallet, connectedChain]);

  // Fetch balance when account or chain changes
  useEffect(() => {
    if (!account) {
      setBalance(null);
      return;
    }

    const fetchBalance = async () => {
      setIsLoading(true);
      try {
        if (walletType === 'substrate' && substrateApi) {
          const balanceInfo = await substrateApi.getBalance(account.address);
          setBalance(balanceInfo.total);
        } else if (walletType === 'evm' && wallet?.provider) {
          // For EVM wallets, we would use ethers.js or similar to fetch balance
          // This is a placeholder - actual implementation would depend on your EVM setup
          const provider = wallet.provider;
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
  }, [account, walletType, substrateApi, wallet]);

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
    
    try {
      await setChain({ chainId });
    } catch (error) {
      console.error('Error switching chain:', error);
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
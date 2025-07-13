import { init } from '@subwallet-connect/react';
import injectedModule from '@subwallet-connect/injected-wallets';
import walletConnectPolkadotModule from '@subwallet-connect/walletconnect-polkadot';
import subwalletPolkadotModule from '@subwallet-connect/subwallet-polkadot';
import polkadot_jsModule from '@subwallet-connect/polkadot-js';
import talismanModule from '@subwallet-connect/talisman';
import walletConnectModule from '@subwallet-connect/walletconnect';
import { TransactionHandlerReturn } from "@subwallet-connect/core/dist/types";

// Project ID for WalletConnect
const PROJECT_ID = process.env.NEXT_PUBLIC_WALLET_PROJECT_ID!;

const injected = injectedModule({
  custom: [],
  filter: {}
});

const walletConnectPolkadot = walletConnectPolkadotModule({
  projectId: PROJECT_ID,
  dappUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://dotheon.xyz/'
});

const subwalletPolkadotWallet = subwalletPolkadotModule();
const polkadotWallet = polkadot_jsModule();
const talismanWallet = talismanModule();
const walletConnect = walletConnectModule({
  projectId: PROJECT_ID,
  dappUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://dotheon.xyz/'
});

export default init({
  theme: "dark",
  connect: {
    autoConnectLastWallet: true,
    autoConnectAllPreviousWallet: true
  },
  accountCenter: {
    desktop: {
      enabled: false,
    },
    mobile: {
      enabled: false
    }
  },
  wcConfigOption: {
    projectId: PROJECT_ID,
    explorerRecommendedWalletIds: []
  },

  // Wallet modules to present to the user
  wallets: [
    subwalletPolkadotWallet,
    polkadotWallet,
    talismanWallet,
    walletConnectPolkadot,
    walletConnect,
    injected
  ],
  
  // EVM chains support
  chains: [
    {
      id: '0x1',
      namespace: 'evm',
      token: 'ETH',
      label: 'Ethereum',
      rpcUrl: process.env.NEXT_PUBLIC_RPC_URL_ETHEREUM || 'https://ethereum.publicnode.com',
      decimal: 18
    },
    {
      id: '0xaa36a7',
      namespace: 'evm',
      token: 'ETH',
      label: 'Sepolia',
      rpcUrl: process.env.NEXT_PUBLIC_RPC_URL_SEPOLIA || 'https://ethereum-sepolia.publicnode.com',
      decimal: 18
    },
    {
      id: '0x14a34',
      namespace: 'evm',
      token: 'ETH',
      label: 'Base Sepolia',
      rpcUrl: process.env.NEXT_PUBLIC_RPC_URL_BASE_SEPOLIA || 'https://sepolia.base.org',
      decimal: 18
    }
  ],

  // Polkadot chains support
  chainsPolkadot: [
    {
      id: '0x91b171bb158e2d3848fa23a9f1c25182fb8e20313b2c1eb49219da7a70ce90c3',
      namespace: 'substrate',
      token: 'DOT',
      label: 'Polkadot',
      blockExplorerUrl: 'polkadot.api.subscan.io',
      decimal: 10
    },
    {
      id: '0xb0a8d493285c2df73290dfb7e61f870f17b41801197a149ca93654499ea3dafe',
      namespace: 'substrate',
      label: 'Kusama',
      decimal: 12,
      token: 'KSM',
      blockExplorerUrl: 'kusama.api.subscan.io'
    },
    {
      id: '0xe143f23803ac50e8f6f8e62695d1ce9e4e1d68aa36c1cd2cfd15340213f3423e',
      namespace: 'substrate',
      token: 'WND',
      decimal: 12,
      label: 'Westend',
      blockExplorerUrl: 'westend.subscan.io'
    }
  ],

  appMetadata: {
    name: process.env.NEXT_PUBLIC_WALLET_APP_NAME || 'Dotheon',
    icon: '<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 0C8.9543 0 0 8.9543 0 20C0 31.0457 8.9543 40 20 40C31.0457 40 40 31.0457 40 20C40 8.9543 31.0457 0 20 0Z" fill="#FF8800"/></svg>',
    logo: '<svg width="100" height="40" viewBox="0 0 100 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 0C8.9543 0 0 8.9543 0 20C0 31.0457 8.9543 40 20 40C31.0457 40 40 31.0457 40 20C40 8.9543 31.0457 0 20 0Z" fill="#FF8800"/><path d="M54.5 10H60.5C66.5 10 70 13.5 70 19.5C70 25.5 66.5 29 60.5 29H54.5V10ZM60.5 25.5C64 25.5 66 23.5 66 19.5C66 15.5 64 13.5 60.5 13.5H58.5V25.5H60.5Z" fill="currentColor"/><path d="M73 10H84V13.5H77V18H83V21.5H77V25.5H84V29H73V10Z" fill="currentColor"/></svg>',
    description: 'Dotheon - Bifrost Liquid Staking',
    recommendedInjectedWallets: [
      {
        name: 'MetaMask',
        url: 'https://metamask.io'
      },
      {
        name: 'SubWallet',
        url: 'https://subwallet.app'
      },
      {
        name: 'Talisman',
        url: 'https://talisman.xyz'
      }
    ],
    agreement: {
      version: '1.0.0',
      termsUrl: 'https://dotheon.xyz/terms',
    }
  },
  notify: {
    desktop: {
      enabled: true,
      transactionHandler: (transaction): TransactionHandlerReturn => {
        if (transaction.eventCode === 'txConfirmed') {
          return {
            autoDismiss: 0
          }
        }
        return {}
      }
    },
    mobile: {
      enabled: true,
      transactionHandler: (transaction): TransactionHandlerReturn => {
        if (transaction.eventCode === 'txConfirmed') {
          return {
            autoDismiss: 0
          }
        }
        return {}
      }
    }
  }
}); 
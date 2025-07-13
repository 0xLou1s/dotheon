import { init } from '@subwallet-connect/react';
import injectedModule from '@subwallet-connect/injected-wallets';
import walletConnectPolkadotModule from '@subwallet-connect/walletconnect-polkadot';
import subwalletPolkadotModule from '@subwallet-connect/subwallet-polkadot';
import polkadot_jsModule from '@subwallet-connect/polkadot-js';
import talismanModule from '@subwallet-connect/talisman';
import walletConnectModule from '@subwallet-connect/walletconnect';

// Project ID for WalletConnect
const PROJECT_ID = process.env.NEXT_PUBLIC_WALLET_PROJECT_ID!;

const injected = injectedModule({
  custom: [],
  filter: {}
});

const walletConnectPolkadot = walletConnectPolkadotModule({
  projectId: PROJECT_ID,
  dappUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://app.dotheon.com/'
});

const subwalletPolkadotWallet = subwalletPolkadotModule();
const polkadotWallet = polkadot_jsModule();
const talismanWallet = talismanModule();
const walletConnect = walletConnectModule({
  projectId: PROJECT_ID,
  dappUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://app.dotheon.com/'
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
      rpcUrl: process.env.NEXT_PUBLIC_RPC_URL_SEPOLIA || 'https://sepolia.basescan.org',
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
    icon: '<svg width="40" height="40" viewBox="0 0 306 306" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="123" r="32" fill="white"/><path d="M44 0H198.701L170.5 45H71L44 0Z" fill="white"/><path d="M196.5 243.5H44L70 200H172L196.5 243.5Z" fill="white"/><path d="M198.683 0L270.5 121.636L218.63 121.636L170.5 45L198.683 0Z" fill="white"/><path d="M270.5 121.636L196.5 243.5L172 200L218.636 121.636L270.5 121.636Z" fill="white"/></svg>',
    logo: '<svg width="200" height="40" viewBox="0 0 1261 306" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M366.25 251C351.417 251 338.667 248.083 328 242.25C317.333 236.417 309.083 228.083 303.25 217.25C297.583 206.417 294.75 193.5 294.75 178.5C294.75 163.333 297.583 150.417 303.25 139.75C309.083 128.917 317.333 120.583 328 114.75C338.667 108.917 351.417 106 366.25 106C388.583 106 406 112.417 418.5 125.25C431.167 138.083 437.5 155.833 437.5 178.5C437.5 193.5 434.667 206.417 429 217.25C423.333 228.083 415.167 236.417 404.5 242.25C393.833 248.083 381.083 251 366.25 251ZM366.25 219.5C376.25 219.5 384.083 215.833 389.75 208.5C395.583 201.167 398.5 191.167 398.5 178.5C398.5 165.667 395.583 155.667 389.75 148.5C384.083 141.167 376.25 137.5 366.25 137.5C356.083 137.5 348.083 141.167 342.25 148.5C336.583 155.667 333.75 165.667 333.75 178.5C333.75 191.167 336.583 201.167 342.25 208.5C348.083 215.833 356.083 219.5 366.25 219.5ZM540.098 248C530.764 248 522.514 245.917 515.348 241.75C508.348 237.417 502.931 231.5 499.098 224C495.264 216.333 493.348 207.667 493.348 198V85.75L532.348 68.25V198C532.348 202.333 532.931 205.917 534.098 208.75C535.431 211.417 537.764 213.417 541.098 214.75C544.598 215.917 549.431 216.5 555.598 216.5H590.848V248H540.098ZM465.848 140.5V109H566.098V140.5H465.848ZM718.695 248V162.5C718.695 155.167 716.862 149.333 713.195 145C709.529 140.667 704.695 138.5 698.695 138.5C691.862 138.5 685.529 140.833 679.695 145.5C674.029 150 668.029 157.833 661.695 169L656.195 136.25C662.529 125.25 670.195 117.5 679.195 113C688.195 108.333 697.362 106 706.695 106C717.362 106 726.445 108.25 733.945 112.75C741.612 117.25 747.445 123.583 751.445 131.75C755.612 139.75 757.695 149.167 757.695 160V248H718.695ZM625.945 248V62.75H664.945V248H625.945ZM855.293 251C840.293 251 827.376 248.083 816.543 242.25C805.876 236.417 797.626 228.083 791.793 217.25C785.96 206.417 783.043 193.5 783.043 178.5C783.043 163.333 785.96 150.333 791.793 139.5C797.626 128.667 806.043 120.417 817.043 114.75C828.21 108.917 841.626 106 857.293 106C881.793 106 899.543 113 910.543 127C921.71 140.833 926.376 159.917 924.543 184.25H814.043L814.293 157.5H884.793C884.293 151.167 881.46 146.083 876.293 142.25C871.126 138.25 864.71 136.25 857.043 136.25C845.043 136.25 836.21 140 830.543 147.5C824.876 155 822.043 165.917 822.043 180.25C822.043 187.417 823.293 194 825.793 200C828.293 206 831.96 210.833 836.793 214.5C841.793 218 847.96 219.75 855.293 219.75C863.126 219.75 869.71 217.833 875.043 214C880.543 210.167 883.876 205.333 885.043 199.5H924.043C922.376 215.333 915.376 227.917 903.043 237.25C890.876 246.417 874.96 251 855.293 251ZM1016.64 251C1001.81 251 989.057 248.083 978.391 242.25C967.724 236.417 959.474 228.083 953.641 217.25C947.974 206.417 945.141 193.5 945.141 178.5C945.141 163.333 947.974 150.417 953.641 139.75C959.474 128.917 967.724 120.583 978.391 114.75C989.057 108.917 1001.81 106 1016.64 106C1038.97 106 1056.39 112.417 1068.89 125.25C1081.56 138.083 1087.89 155.833 1087.89 178.5C1087.89 193.5 1085.06 206.417 1079.39 217.25C1073.72 228.083 1065.56 236.417 1054.89 242.25C1044.22 248.083 1031.47 251 1016.64 251ZM1016.64 219.5C1026.64 219.5 1034.47 215.833 1040.14 208.5C1045.97 201.167 1048.89 191.167 1048.89 178.5C1048.89 165.667 1045.97 155.667 1040.14 148.5C1034.47 141.167 1026.64 137.5 1016.64 137.5C1006.47 137.5 998.474 141.167 992.641 148.5C986.974 155.667 984.141 165.667 984.141 178.5C984.141 191.167 986.974 201.167 992.641 208.5C998.474 215.833 1006.47 219.5 1016.64 219.5ZM1206.49 248V162.25C1206.49 155.083 1204.65 149.333 1200.99 145C1197.32 140.667 1192.49 138.5 1186.49 138.5C1179.65 138.5 1173.32 140.833 1167.49 145.5C1161.82 150 1155.82 157.833 1149.49 169L1143.99 136C1150.32 125.167 1157.99 117.5 1166.99 113C1175.99 108.333 1185.15 106 1194.49 106C1205.15 106 1214.24 108.25 1221.74 112.75C1229.4 117.25 1235.24 123.5 1239.24 131.5C1243.4 139.5 1245.49 148.917 1245.49 159.75V248H1206.49ZM1113.74 248V109H1151.49L1152.74 133.75V248H1113.74Z" fill="white"/><path d="M44 0H198.701L170.5 45H71L44 0Z" fill="white"/><path d="M196.5 243.5H44L70 200H172L196.5 243.5Z" fill="white"/><path d="M198.683 0L270.5 121.636L218.63 121.636L170.5 45L198.683 0Z" fill="white"/><path d="M270.5 121.636L196.5 243.5L172 200L218.636 121.636L270.5 121.636Z" fill="white"/><circle cx="32" cy="123" r="32" fill="white"/></svg>',
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
      termsUrl: 'https://app.dotheon.com/terms',
    }
  },
  
  // Disable built-in notifications from SubWallet Connect
  notify: {
    desktop: {
      enabled: false,
      transactionHandler: () => ({})
    },
    mobile: {
      enabled: false,
      transactionHandler: () => ({})
    }
  }
}); 
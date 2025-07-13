import { ApiPromise, WsProvider } from '@polkadot/api';

export class SubstrateApi {
  private api: ApiPromise | null = null;
  private provider: WsProvider;
  private connecting = false;
  
  constructor(wsProvider: string) {
    this.provider = new WsProvider(wsProvider);
  }
  
  async connect(): Promise<ApiPromise> {
    if (this.api) {
      return this.api;
    }
    
    if (this.connecting) {
      // Wait until the connection is established
      return new Promise((resolve) => {
        const checkInterval = setInterval(() => {
          if (this.api) {
            clearInterval(checkInterval);
            resolve(this.api);
          }
        }, 100);
      });
    }
    
    this.connecting = true;
    
    try {
      this.api = await ApiPromise.create({ provider: this.provider });
      return this.api;
    } catch (error) {
      console.error('Failed to connect to Substrate node:', error);
      throw error;
    } finally {
      this.connecting = false;
    }
  }
  
  async disconnect(): Promise<void> {
    if (this.api) {
      await this.api.disconnect();
      this.api = null;
    }
  }
  
  async getBalance(address: string): Promise<{ free: string; reserved: string; frozen: string; total: string }> {
    const api = await this.connect();
    const { data: balance } = await api.query.system.account(address);
    
    return {
      free: balance.free.toString(),
      reserved: balance.reserved.toString(),
      frozen: balance.frozen ? balance.frozen.toString() : '0',
      total: balance.free.add(balance.reserved).toString()
    };
  }
  
  async getChainInfo(): Promise<{ name: string; tokenSymbol: string; tokenDecimals: number }> {
    const api = await this.connect();
    const [chain, nodeName, nodeVersion, properties] = await Promise.all([
      api.rpc.system.chain(),
      api.rpc.system.name(),
      api.rpc.system.version(),
      api.rpc.system.properties()
    ]);
    
    return {
      name: chain.toString(),
      tokenSymbol: properties.tokenSymbol.isNone
        ? 'UNIT'
        : properties.tokenSymbol.value[0].toString(),
      tokenDecimals: properties.tokenDecimals.isNone
        ? 12
        : properties.tokenDecimals.value[0].toNumber()
    };
  }
}

// Network endpoints for common Polkadot networks
export const POLKADOT_NETWORKS = {
  Polkadot: {
    name: 'Polkadot',
    wsProvider: 'wss://rpc.polkadot.io',
    color: '#E6007A'
  },
  Kusama: {
    name: 'Kusama',
    wsProvider: 'wss://kusama-rpc.polkadot.io',
    color: '#000000'
  },
  Westend: {
    name: 'Westend',
    wsProvider: 'wss://westend-rpc.polkadot.io',
    color: '#da68a7'
  }
}; 
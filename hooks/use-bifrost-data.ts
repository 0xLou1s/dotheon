import { useState, useEffect } from 'react';

export interface HolderInfo {
  name: string;
  holders: number;
  unique_id?: string;
  network: string;
  url: string;
}

export interface TokenData {
  apy?: string;
  apyBase?: string;
  apyReward?: string;
  tvl: number;
  tvm: number;
  totalIssuance?: number;
  holders: number;
  holdersList?: HolderInfo[];
  // Special fields for vETH
  totalApy?: string;
  stakingApy?: string;
  mevApy?: string;
  farmingAPY?: string;
  gasFeeApy?: string;
  // Dynamic price fields
  [key: string]: string | number | HolderInfo[] | undefined;
}

export interface BifrostData {
  tvl: number;
  addresses: number;
  revenue: number;
  bncPrice: number;
  [key: string]: any; // For token data with dynamic keys
}

export function useBifrostData() {
  const [data, setData] = useState<BifrostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://dapi.bifrost.io/api/site');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const jsonData = await response.json();
        setData(jsonData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Refresh data every 5 minutes
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const getTokenData = (symbol: string): TokenData | null => {
    if (!data) return null;
    return data[symbol] || null;
  };

  const getAllTokens = (): { symbol: string; data: TokenData }[] => {
    if (!data) return [];
    
    return Object.entries(data)
      .filter(([key, value]) => key.startsWith('v') && typeof value === 'object')
      .map(([symbol, tokenData]) => ({
        symbol,
        data: tokenData as TokenData,
      }));
  };

  return {
    data,
    loading,
    error,
    getTokenData,
    getAllTokens,
  };
} 
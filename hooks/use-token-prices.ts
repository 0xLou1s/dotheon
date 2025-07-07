import { useState, useEffect } from 'react';

interface TokenPrices {
  [key: string]: number;
}

interface PricesResponse {
  prices: TokenPrices;
}

export function useTokenPrices() {
  const [prices, setPrices] = useState<TokenPrices | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://dapi.bifrost.io/api/dapp/prices');
        if (!response.ok) {
          throw new Error('Failed to fetch prices');
        }
        const data: PricesResponse = await response.json();
        setPrices(data.prices);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
    
    // Refresh prices every minute
    const interval = setInterval(fetchPrices, 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const getTokenPrice = (symbol: string): number => {
    if (!prices) return 0;
    return prices[symbol.toLowerCase()] || 0;
  };

  return {
    prices,
    loading,
    error,
    getTokenPrice,
  };
} 
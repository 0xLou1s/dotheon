import { tool as createTool } from "ai";
import { z } from "zod";
import { TokenStatistics } from "@/containers/dashboard/token-statistics/token-statistics";

const tokenList = [
    'vDOT', 'vETH', 'vKSM', 'vPHA', 'vASTR',
    'vMANTA', 'vBNC', 'vMOVR', 'vGLMR', 'vFIL',
    'DOT', 'ETH', 'KSM', 'PHA', 'ASTR',
    'MANTA', 'BNC', 'MOVR', 'GLMR', 'FIL',
    'ALL'
  ] as const;

const baseMetrics = [
  "price",
  "apy",
  "tvl",
];


export const vTokenInfoTool = createTool({
  description:
    "This tool displays the full statistics table for all Bifrost vTokens. It does not require any parameters. Use this tool directly when the user asks about vToken statistics, metrics, or performance.",
  parameters: z.object({}),
  execute: async () => {
    return {
      text: "Here's the statistics for all vTokens.",
    };
  },
});

export const getVTokenPrice = createTool({
    description: 'Get the current price of a specific vToken or base token, or fetch prices for all supported tokens.',
    parameters: z.object({
      token: z.enum(tokenList).describe('vToken symbol (e.g. vDOT) or base token symbol (e.g. DOT), or "ALL" to get all prices')
    }),
    execute: async ({ token }) => {
        try {
          const response = await fetch('https://dapi.bifrost.io/api/dapp/prices');
          if (!response.ok) {
            return { 
              token, 
              price: 0,
              text: `Failed to fetch price for ${token}. The service might be temporarily unavailable.`
            };
          }
        
          const data = await response.json();
          const prices = data.prices;
        
          if (token === 'ALL') {
            const allPrices = Object.entries(prices).map(([token, price]) => ({
              token,
              price: Number(price)
            }));
            
            const priceText = allPrices
              .map(p => `${p.token}: ${p.price.toFixed(4)}`)
              .join('\n');
              
            return {
              token: 'ALL',
              price: allPrices,
              text: `Current token prices:\n${priceText}`
            };
          }
        
          const tokenLower = token.toLowerCase();
          const price = prices[tokenLower];
          console.log('Price for', tokenLower, ':', price);
          
          if (price === undefined) {
            return { 
              text: `No price data available for **${token}**`
            };
          }
        
          return {
            token: tokenLower,
            price: Number(price),
            text: `The current price of **${token}** is **$${Number(price).toFixed(4)}**`
          };
        } catch (error) {
          console.error('Error fetching prices:', error);
          return { 
            text: `Error fetching price for **${token}**. Please try again later.`
          };
        }
      }
  });

export const tools = {
  displayVTokenInfo: vTokenInfoTool,
  getVTokenPrice: getVTokenPrice,
};

export const ComponentMap: Record<string, React.ComponentType<any>> = {
  displayVTokenInfo: TokenStatistics,
};


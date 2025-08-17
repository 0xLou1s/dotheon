import { tool as createTool } from "ai";
import { z } from "zod";
import { TokenStatistics } from "@/containers/dashboard/token-statistics/token-statistics";
import ChatMint from "@/components/widget-call-tool/chat-mint";
import ChatRedeem from "@/components/widget-call-tool/chat-redeem";

const tokenList = [
    'vDOT', 'vETH', 'vKSM', 'vPHA', 'vASTR',
    'vMANTA', 'vBNC', 'vMOVR', 'vGLMR', 'vFIL',
    'DOT', 'ETH', 'KSM', 'PHA', 'ASTR',
    'MANTA', 'BNC', 'MOVR', 'GLMR', 'FIL',
    'ALL'
  ] as const;


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

export const mintVTokenTool = createTool({
  description: "CRITICAL: Use this tool whenever users mention ANY of these: mint, stake, staking, convert to vToken, DOT to vDOT, ETH to vETH, I want to mint, help me mint. This tool shows the minting interface for liquid staking.",
  parameters: z.object({}),
  execute: async () => {
    return {
      text: `I'll help you mint vTokens! Dotheon currently supports minting DOT to vDOT and ETH to vETH. For other tokens, please visit [Bifrost VStaking](https://app.bifrost.io/vstaking).

Here's the minting interface:`,
      toolName: "mintVToken",
      toolResult: {
        initialToken: 'vDOT',
        initialAmount: ""
      }
    };
  },
});

export const redeemVTokenTool = createTool({
  description: "CRITICAL: Use this tool whenever users mention ANY of these: redeem, unstake, unstaking, convert back, get back, vDOT to DOT, vETH to ETH, I want to redeem, help me redeem. This tool shows the redemption interface for liquid staking.",
  parameters: z.object({}),
  execute: async () => {
    return {
      text: `I'll help you redeem vTokens! Dotheon currently supports redeeming vDOT back to DOT and vETH back to ETH. For other tokens, please visit [Bifrost VStaking](https://app.bifrost.io/vstaking).

Here's the redemption interface:`,
      toolName: "redeemVToken",
      toolResult: {
        initialToken: 'vDOT',
        initialAmount: ""
      }
    };
  },
});


export const tools = {
  displayVTokenInfo: vTokenInfoTool,
  getVTokenPrice: getVTokenPrice,
  mintVToken: mintVTokenTool,
  redeemVToken: redeemVTokenTool,
};

export const ComponentMap: Record<string, React.ComponentType<any>> = {
  displayVTokenInfo: TokenStatistics,
  mintVToken: ChatMint,
  redeemVToken: ChatRedeem,
};


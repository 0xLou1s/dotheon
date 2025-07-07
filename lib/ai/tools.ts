import { tool as createTool } from 'ai';
import { z } from 'zod';
import { TokenStatistics } from '@/containers/dashboard/token-statistics/token-statistics';

// define list of supported tokens
const supportedTokens = [
  'all', 'price', 'price_all', 'price_all_usd',
  'apy', 'apy_all', 'apy_all_usd',
  'tvl', 'tvl_all', 'tvl_all_usd',
  'volume', 'volume_all', 'volume_all_usd',
  'liquidity', 'liquidity_all', 'liquidity_all_usd',
  'price_change', 'price_change_all', 'price_change_all_usd',
  'price_change_percentage', 'price_change_percentage_all', 'price_change_percentage_all_usd',
  'vDOT', 'vPHA', 'vETH', 'vKSM', 'vASTR',
  'vMANTA', 'vBNC', 'vMOVR', 'vGLMR', 'vFIL'
];

export const vTokenInfoTool = createTool({
  description: 'Display detailed statistics and information about a specific vToken (e.g. vDOT, vPHA, vETH, vKSM, vASTR, vMANTA, vBNC, vMOVR, vGLMR, vFIL). Use this tool when users ask about token statistics, APY, TVL, or other metrics for a particular vToken.',
  parameters: z.object({
    token: z.enum(supportedTokens as [string, ...string[]]).describe('The vToken symbol to get statistics for (must be one of: vDOT, vPHA, vETH, vKSM, vASTR, vMANTA, vBNC, vMOVR, vGLMR, vFIL) or "all" to get statistics for all vTokens or "price" to get the price of the vToken')
  }),
  execute: async ({ token }: { token: string }) => {
    return {};
  }
});

export const tools = {
  displayVTokenInfo: vTokenInfoTool,
};

export const ComponentMap: Record<string, React.ComponentType<any>> = {
  displayVTokenInfo: TokenStatistics,
};

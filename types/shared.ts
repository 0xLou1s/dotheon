export interface BalancesProps {
    nativeBalance: bigint;
    isNativeBalanceLoading: boolean;
    refetchNativeBalance: () => void;
    tokenBalances: bigint[];
    isTokenBalancesLoading: boolean;
    refetchTokenBalances: () => void;
  }
  
  export interface MintProps {
    nativeBalance: bigint | undefined;
    tokenBalances: readonly [bigint | undefined, bigint | undefined, bigint | undefined] | undefined;
  }
  
  export interface RedeemProps {
    tokenBalances: readonly [bigint | undefined, bigint | undefined, bigint | undefined] | undefined;
  }
  
  export interface DepositToVaultProps {
    tokenBalances: readonly [bigint | undefined, bigint | undefined, bigint | undefined] | undefined;
  }
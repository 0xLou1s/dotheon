import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Connector } from "wagmi";

// @ts-expect-error: owned by ngard
import { isEqual } from "@ngard/tiny-isequal";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function roundLongDecimals(string?: string, decimals?: number) {
  if (!string || !decimals) {
    return "-";
  }

  if (string === "0") {
    return "0";
  }

  // if stringToNumber doesn't have decimals, don't add them
  if (!string.includes(".")) {
    return string;
  }

  const stringToNumber = Number(string);
  return stringToNumber.toFixed(decimals);
}

export function truncateHash(hash: string, startLength: number = 6, endLength: number = 4) {
  return `${hash.slice(0, startLength)}...${hash.slice(-endLength)}`;
}

// Format a number string with thousand separators
export function formatNumberStringWithThousandSeparators(value: string) {
  if (value === "") {
    return "";
  }

  return Number(value).toLocaleString();
}


export function getWalletName(connector: Connector | undefined) {
  if (!connector) {
    return "Unknown";
  }
  return connector.name;
}

export function getWalletIcon(connector: Connector | undefined) {
  if (!connector) {
    return null;
  }
  return connector.icon;
}

export function truncateAddress(address: string) {
  if (!address) {
    return "Unknown";
  }
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function isDeepEqual(a: unknown, b: unknown): boolean {
  return isEqual(a, b);
}

export function formatCurrency(value: number): string {
  if (value >= 1000000000) {
    return `$ ${(value / 1000000000).toFixed(4)} B`;
  }
  if (value >= 1000000) {
    return `$ ${(value / 1000000).toFixed(4)} M`;
  }
  if (value >= 1000) {
    return `$ ${(value / 1000).toFixed(4)} K`;
  }
  return `$ ${value.toFixed(4)}`;
}

/**
 * Format a balance with the appropriate number of decimals and token symbol
 * @param balance The balance as a string
 * @param decimals The number of decimals for the token
 * @param symbol The token symbol
 * @param displayDecimals The number of decimals to display (default: 4)
 * @returns Formatted balance string with token symbol
 */
export function formatBalance(
  balance: string,
  decimals: number,
  symbol: string,
  displayDecimals: number = 4
): string {
  if (!balance) return `0 ${symbol}`;
  
  try {
    // Convert balance to a number with the correct decimal places
    const balanceNum = Number(balance) / Math.pow(10, decimals);
    
    // Format the number with the specified number of decimal places
    const formattedBalance = balanceNum.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: displayDecimals
    });
    
    return `${formattedBalance} ${symbol}`;
  } catch (error) {
    console.error('Error formatting balance:', error);
    return `0 ${symbol}`;
  }
}
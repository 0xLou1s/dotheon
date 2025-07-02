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
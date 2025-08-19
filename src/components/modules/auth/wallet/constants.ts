import { StellarNetwork, isValidStellarNetwork } from "@/utils/hook/valid-data.hook";

/**
 * Stellar network configuration constants
 * Contains Horizon API URLs for testnet and mainnet
 */

export const HORIZON_URLS: Readonly<Record<StellarNetwork, string>> = {
  testnet: "https://horizon-testnet.stellar.org",
  mainnet: "https://horizon.stellar.org",
} as const;

// Re-export the validation function for convenience
export { isValidStellarNetwork };

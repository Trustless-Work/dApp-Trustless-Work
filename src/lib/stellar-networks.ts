/**
 * Stellar network configuration constants
 * Contains Horizon API URLs for testnet and mainnet
 */
export const HORIZON_URLS: Readonly<Record<"testnet" | "mainnet", string>> = {
  testnet: "https://horizon-testnet.stellar.org",
  mainnet: "https://horizon.stellar.org",
} as const;

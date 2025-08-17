/**
 * Stellar network configuration constants
 * Contains Horizon API URLs and USDC issuer addresses for testnet and mainnet
 */

export type StellarNetwork = "testnet" | "mainnet";

export const HORIZON_URLS: Readonly<Record<StellarNetwork, string>> = {
  testnet: "https://horizon-testnet.stellar.org",
  mainnet: "https://horizon.stellar.org",
} as const;

export const USDC_ISSUERS: Readonly<Record<StellarNetwork, string>> = {
  testnet: "GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVBL4LADV2C3B6O4JUEVL", // Testnet USDC
  mainnet: "GA5ZSEJYB37JRC5AVCIA5MOP4RHTM35XDP5G2O4D3J6I6K6WOH2L3VSE", // Mainnet USDC
} as const;

// Validation function to ensure network is valid
export const isValidStellarNetwork = (
  network: string,
): network is StellarNetwork => {
  return network === "testnet" || network === "mainnet";
};

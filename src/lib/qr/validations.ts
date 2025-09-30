import { trustlines } from "@/constants/trustlines.constant";
import { StrKey } from "@stellar/stellar-sdk";

/**
 * Validates a Stellar contract address (Soroban).
 * Contract addresses start with 'C' and are 56 characters long.
 *
 * @param {string} address - The contract address to validate
 * @returns {{isValid: boolean, error?: string}} Validation result with optional error message
 *
 * @example
 * validateContractAddress("CCTKDUS5GEXMOAWTVIEHSQHESYGHVAVPSEACUO5EM2RUGI7OC2EHY63V")
 * // Returns: { isValid: true }
 *
 * validateContractAddress("GABC...")
 * // Returns: { isValid: false, error: "Invalid contract address" }
 */
export const validateContractAddress = (
  address: string,
): { isValid: boolean; error?: string } => {
  if (!address) {
    return { isValid: false, error: "Address is required" };
  }

  if (!StrKey.isValidContract(address)) {
    return { isValid: false, error: "Invalid contract address" };
  }

  return { isValid: true };
};

/**
 * Validates that an amount is a positive number with max 7 decimal places.
 * Follows Stellar's standard for asset amounts.
 * NOTE: Can use isValidAmount from StellarSdk on bumping it to v14.0.0
 *
 * @param {string | undefined} amount - The amount to validate (optional)
 * @returns {{isValid: boolean, error?: string}} Validation result with optional error message
 *
 * @example
 * validateAmount("100.50")     // Returns: { isValid: true }
 * validateAmount("0.1234567")  // Returns: { isValid: true }
 * validateAmount("0.12345678") // Returns: { isValid: false, error: "Max 7 decimal places allowed" }
 * validateAmount("-10")        // Returns: { isValid: false, error: "Amount must be positive" }
 */
export const validateAmount = (
  amount: string | undefined,
): { isValid: boolean; error?: string } => {
  if (!amount) {
    return { isValid: true }; // Optional field
  }

  const parsed = parseFloat(amount);

  if (isNaN(parsed)) {
    return { isValid: false, error: "Amount must be a number" };
  }

  if (parsed <= 0) {
    return { isValid: false, error: "Amount must be positive" };
  }

  // Check decimal places (Stellar max is 7)
  const parts = amount.split(".");
  if (parts[1] && parts[1].length > 7) {
    return { isValid: false, error: "Max 7 decimal places allowed" };
  }

  const STELLAR_MAX_AMOUNT = 922337203685.4775; // Safe approximation
  if (parsed > STELLAR_MAX_AMOUNT) {
    return { isValid: false, error: "Amount exceeds maximum" };
  }

  return { isValid: true };
};

/**
 * Validates memo text for Stellar transactions.
 * Text memos are limited to 28 bytes.
 *
 * @param {string | undefined} memo - The memo text to validate (optional)
 * @returns {{isValid: boolean, error?: string}} Validation result with optional error message
 *
 * @example
 * validateMemo("Payment for services") // Returns: { isValid: true }
 * validateMemo("This memo is way too long and exceeds the byte limit") // Returns: { isValid: false, error: "Memo too long (52/28 bytes)" }
 */
export const validateMemo = (
  memo: string | undefined,
): { isValid: boolean; error?: string } => {
  if (!memo) {
    return { isValid: true }; // Optional field
  }

  // Text memo limit is 28 bytes in Stellar
  const byteLength = new TextEncoder().encode(memo).length;
  if (byteLength > 28) {
    return {
      isValid: false,
      error: `Memo too long (${byteLength}/28 bytes)`,
    };
  }

  return { isValid: true };
};

/**
 * Validates message for SEP-7 URI.
 * Ensures reasonable length for QR code efficiency and no line breaks.
 *
 * @param {string | undefined} msg - The message to validate (optional)
 * @returns {{isValid: boolean, error?: string}} Validation result with optional error message
 */
export const validateMessage = (
  msg: string | undefined,
): { isValid: boolean; error?: string } => {
  if (!msg) {
    return { isValid: true }; // Optional field
  }

  // Reasonable limit for QR code efficiency
  if (msg.length > 256) {
    return {
      isValid: false,
      error: `Message too long (${msg.length}/256 chars)`,
    };
  }

  // Check for problematic characters that might break URI
  if (msg.includes("\n") || msg.includes("\r")) {
    return {
      isValid: false,
      error: "Message cannot contain line breaks",
    };
  }

  return { isValid: true };
};

/**
 * Validates origin domain format.
 * Checks for valid domain syntax and reasonable length.
 *
 * @param {string | undefined} origin_domain - The domain to validate (optional)
 * @returns {{isValid: boolean, error?: string}} Validation result with optional error message
 *
 * @example
 * validateOriginDomain("example.com")  // Returns: { isValid: true }
 * validateOriginDomain("sub.example.co.uk") // Returns: { isValid: true }
 * validateOriginDomain("invalid_domain") // Returns: { isValid: false, error: "Invalid domain format" }
 */
export const validateOriginDomain = (
  origin_domain: string | undefined,
): { isValid: boolean; error?: string } => {
  if (!origin_domain) {
    return { isValid: true }; // Optional field
  }

  // Basic domain validation
  const domainRegex = /^[a-z0-9]+([-.][a-z0-9]+)*\.[a-z]{2,}$/i;

  if (!domainRegex.test(origin_domain)) {
    return {
      isValid: false,
      error: "Invalid domain format",
    };
  }

  // Check reasonable length
  if (origin_domain.length > 253) {
    return {
      isValid: false,
      error: "Domain too long",
    };
  }

  return { isValid: true };
};

/**
 * Validates that an asset code exists in the trustlines configuration.
 * Checks if the asset is supported on the specified network.
 *
 * @param {string | undefined} assetCode - The asset code to validate (e.g., "USDC", "EURC") (optional)
 * @param {"testnet" | "mainnet"} network - The network to check against
 * @returns {{isValid: boolean, error?: string}} Validation result with optional error message
 *
 * @example
 * validateAssetCode("USDC", "testnet")  // Returns: { isValid: true }
 * validateAssetCode("DOGE", "mainnet")  // Returns: { isValid: false, error: "Asset DOGE not supported on mainnet" }
 */
export const validateAssetCode = (
  assetCode: string | undefined,
  network: "testnet" | "mainnet",
): { isValid: boolean; error?: string } => {
  if (!assetCode) {
    return { isValid: true }; // Optional field, empty is valid
  }

  const validAsset = trustlines.find(
    (t) => t.name === assetCode && t.network === network,
  );

  if (!validAsset) {
    return {
      isValid: false,
      error: `Asset ${assetCode} not supported on ${network}`,
    };
  }

  return { isValid: true };
};

/**
 * Validates that an asset issuer matches the expected issuer from trustlines.
 * Ensures the issuer address matches what's configured for the asset.
 *
 * @param {string | undefined} assetCode - The asset code (e.g., "USDC", "EURC") (optional)
 * @param {string | undefined} assetIssuer - The issuer address to validate (optional)
 * @param {"testnet" | "mainnet"} network - The network to check against
 * @returns {{isValid: boolean, error?: string}} Validation result with optional error message
 */
export const validateAssetIssuer = (
  assetCode: string | undefined,
  assetIssuer: string | undefined,
  network: "testnet" | "mainnet",
): { isValid: boolean; error?: string } => {
  if (!assetCode) {
    return { isValid: true }; // No asset, no issuer needed
  }

  const trustline = trustlines.find(
    (t) => t.name === assetCode && t.network === network,
  );

  if (!trustline) {
    return {
      isValid: false,
      error: `Asset ${assetCode} not found in trustlines`,
    };
  }

  // If issuer provided, must match trustline
  if (assetIssuer && assetIssuer !== trustline.address) {
    return {
      isValid: false,
      error: `Invalid issuer for ${assetCode}`,
    };
  }

  return { isValid: true };
};

/**
 * Comprehensive validation for asset code and issuer combination.
 * Validates that the asset exists, and if not XLM, has the correct issuer.
 *
 * @param {"testnet" | "mainnet"} network - The network to validate against
 * @param {string | undefined} assetCode - The asset code (e.g., "USDC", "XLM") (optional)
 * @param {string | undefined} assetIssuer - The issuer address (optional, not needed for XLM)
 * @returns {{isValid: boolean, error?: string}} Validation result with optional error message
 *
 * @example
 * validateAsset("testnet", "XLM")  // Returns: { isValid: true }
 * validateAsset("testnet", "USDC", "CBIEL...")  // Returns: { isValid: true } if issuer matches
 * validateAsset("testnet", "USDC")  // Returns: { isValid: false, error: "Asset issuer required for USDC" }
 */
export const validateAsset = (
  network: "testnet" | "mainnet",
  assetCode?: string,
  assetIssuer?: string,
): { isValid: boolean; error?: string } => {
  // No asset provided - valid (optional)
  if (!assetCode) {
    return { isValid: true };
  }

  // XLM doesn't need issuer or trustline
  if (assetCode === "XLM") {
    return { isValid: true };
  }

  // Find trustline for this asset on this network
  const trustline = trustlines.find(
    (t) => t.name === assetCode && t.network === network,
  );

  // Asset not supported on this network
  if (!trustline) {
    return {
      isValid: false,
      error: `Asset ${assetCode} not supported on ${network}`,
    };
  }

  // Non-XLM assets require issuer
  if (!assetIssuer) {
    return {
      isValid: false,
      error: `Asset issuer required for ${assetCode}`,
    };
  }

  // Issuer must match trustline
  if (assetIssuer !== trustline.address) {
    return {
      isValid: false,
      error: `Invalid issuer for ${assetCode} on ${network}`,
    };
  }

  return { isValid: true };
};

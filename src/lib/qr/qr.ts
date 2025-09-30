/**
 * @fileoverview QR Code Payload Generation Module for Stellar Escrow Deposits
 *
 * This module provides a flexible QR code payload generation system that supports
 * multiple encoding strategies for different Stellar wallets. It intelligently
 * selects the best encoding format based on wallet compatibility and falls back
 * to simpler formats when advanced features aren't supported.
 *
 * @module lib/qr
 */

import { generateSEP7Payload } from "@/lib/qr/sep7";
import { generateFreighterPayload } from "@/lib/qr/sorban-intent";
import { generateLobstrPayload } from "@/lib/qr/lobstr-hint";
import { trustlines } from "@/constants/trustlines.constant";

// ============================================================
// TYPE DEFINITIONS & INTERFACES
// ============================================================

/**
 * Available encoding strategies for QR payload generation.
 * Each strategy targets different wallet capabilities and standards.
 *
 * @typedef {string} EncodingStrategy
 * @enum {string}
 *
 * - `auto` - Intelligently tries multiple encodings in priority order
 * - `sep7-suggest` - SEP-7 standard URI format (web+stellar:pay)
 * - `plain` - Simple address-only encoding (universal compatibility)
 * - `freighter-intent` - Soroban transaction XDR for Freighter wallet
 * - `lobstr-hint` - Deep link format for Lobstr wallet (experimental)
 */
export type EncodingStrategy =
  | "auto"
  | "sep7-suggest"
  | "plain"
  | "freighter-intent"
  | "lobstr-hint";

/**
 * Configuration options for QR payload generation.
 * Contains all parameters needed to create payment requests for different encoding strategies.
 *
 * @interface PayloadOptions
 *
 * @property {string} escrowAddress - Destination address (Soroban contract or regular account)
 * @property {"testnet" | "mainnet"} network - Stellar network to use
 * @property {string} [assetCode] - Optional. Asset to transfer (e.g., "USDC", "EURC", "XLM")
 * @property {string} [assetIssuer] - Optional. Asset issuer address (required for non-XLM in SEP-7)
 * @property {string} [amount] - Optional. Amount to transfer in human-readable format (e.g., "100.50")
 * @property {EncodingStrategy} [encoding] - Optional. Specific encoding strategy to use (defaults to "auto")
 * @property {string} [memo] - Optional. Transaction memo (max 28 bytes)
 * @property {string} [msg] - Optional. Message for SEP-7 URI (max 256 chars)
 * @property {string} [origin_domain] - Optional. Domain requesting the payment
 */
export interface PayloadOptions {
  escrowAddress: string;
  network: "testnet" | "mainnet";
  assetCode?: string;
  assetIssuer?: string;
  amount?: string;
  encoding?: EncodingStrategy;
  memo?: string;
  msg?: string;
  origin_domain?: string;
}

// ============================================================
// CONSTANTS & CONFIGURATION
// ============================================================

/**
 * Feature flags to enable/disable experimental encoding strategies.
 * Allows runtime control of which encodings are available in auto mode.
 *
 * @constant {Object} FEATURE_FLAGS
 * @property {boolean} ENABLE_FREIGHTER_INTENT - Enable Soroban XDR encoding for Freighter
 * @property {boolean} ENABLE_LOBSTR_HINT - Enable deep link encoding for Lobstr
 */
export const FEATURE_FLAGS = {
  ENABLE_FREIGHTER_INTENT: false,
  ENABLE_LOBSTR_HINT: false,
};

/**
 * Priority order for encoding strategies in auto mode.
 * Strategies are tried in this order until one succeeds.
 * Order is optimized for best user experience and wallet compatibility.
 *
 * @constant {EncodingStrategy[]} ENCODING_PRIORITY
 * @private
 */
const ENCODING_PRIORITY: EncodingStrategy[] = [
  "freighter-intent", // Try Freighter first (most feature-rich for Soroban)
  "sep7-suggest", // Standard SEP-7 (widest wallet support)
  "plain", // Universal fallback (always works)
  "lobstr-hint", // Experimental deep link (lowest priority)
];

/**
 * Maximum character length for QR code payloads.
 * Based on QR code capacity limits for reliable scanning.
 *
 * @constant {number} MAX_QR_PAYLOAD_LENGTH
 */
export const MAX_QR_PAYLOAD_LENGTH = 2953;

// ============================================================
// PUBLIC API
// ============================================================

/**
 * Generates a QR code payload using the specified encoding strategy.
 *
 * This is the main entry point for QR code generation. It supports multiple
 * encoding strategies to maximize wallet compatibility. The function guarantees
 * to always return a scannable payload, falling back to plain address if needed.
 *
 * **Encoding Strategies:**
 * - `auto`: Intelligently tries multiple formats, falling back as needed
 * - `sep7-suggest`: Standard Stellar payment URI (requires proper asset issuers)
 * - `freighter-intent`: Soroban transaction XDR (requires token contracts)
 * - `lobstr-hint`: Deep link format (experimental)
 * - `plain`: Simple address encoding (universal fallback)
 *
 * @param {PayloadOptions} options - Configuration for payload generation
 * @returns {string} Encoded payload ready for QR code generation
 *
 * @throws {Error} Only in non-auto mode when the specific encoding fails
 *
 * @example
 * // Auto mode (recommended) - tries multiple encodings
 * const payload = generateQRPayload({
 *   escrowAddress: "CCTKDUS5GEXMOAWTVIEHSQHESYGHVAVPSEACUO5EM2RUGI7OC2EHY63V",
 *   network: "testnet",
 *   assetCode: "USDC",
 *   amount: "100"
 * });
 *
 * @example
 * // Force specific encoding
 * const payload = generateQRPayload({
 *   escrowAddress: "CCTKDUS5GEXMOAWTVIEHSQHESYGHVAVPSEACUO5EM2RUGI7OC2EHY63V",
 *   network: "testnet",
 *   encoding: "sep7-suggest",
 *   assetCode: "XLM",
 *   amount: "50"
 * });
 */
export const generateQRPayload = (options: PayloadOptions): string => {
  const { escrowAddress, encoding = "auto", assetCode, network } = options;

  // Auto-populate assetIssuer from trustlines if not provided
  const enhancedOptions = { ...options };
  if (assetCode && assetCode !== "XLM" && !options.assetIssuer) {
    const trustline = trustlines.find(
      (t) => t.name === assetCode && t.network === network,
    );
    if (trustline) {
      enhancedOptions.assetIssuer = trustline.address;
    }
  }

  switch (encoding) {
    case "auto":
      return generateAutoPayload(enhancedOptions);
    case "sep7-suggest":
      return generateSEP7Payload(enhancedOptions);
    case "freighter-intent":
      return generateFreighterPayload(enhancedOptions);
    case "lobstr-hint":
      return generateLobstrPayload(enhancedOptions);
    case "plain":
    default:
      return escrowAddress;
  }
};

/**
 * Automatically selects the best encoding strategy based on availability and compatibility.
 *
 * This function implements a smart fallback mechanism that tries encoding strategies
 * in priority order until one succeeds. It ensures that a QR code can always be
 * generated, even if advanced features aren't available.
 *
 * **Strategy Selection Process:**
 * 1. Filters available encodings based on feature flags
 * 2. Tries each encoding in priority order
 * 3. Returns the first successful encoding
 * 4. Falls back to plain address if all encodings fail
 *
 * **Current Priority Order:**
 * 1. Freighter Intent (if enabled) - Best for Soroban contracts
 * 2. SEP-7 - Standard format with wide support
 * 3. Plain - Universal compatibility
 * 4. Lobstr Hint (if enabled) - Experimental deep links
 *
 * @param {PayloadOptions} options - Configuration for payload generation
 * @returns {string} Successfully encoded payload using the best available strategy
 *
 * @private
 *
 * @example
 * // Called internally by generateQRPayload when encoding="auto"
 * const payload = generateAutoPayload({
 *   escrowAddress: "CCTKDUS5GEXMOAWTVIEHSQHESYGHVAVPSEACUO5EM2RUGI7OC2EHY63V",
 *   network: "testnet",
 *   assetCode: "USDC",
 *   amount: "100"
 * });
 * // Returns: Encoded payload using first successful strategy
 */
const generateAutoPayload = (options: PayloadOptions): string => {
  // Auto-populate assetIssuer if not already done
  const enhancedOptions = { ...options };
  if (
    options.assetCode &&
    options.assetCode !== "XLM" &&
    !options.assetIssuer
  ) {
    const trustline = trustlines.find(
      (t) => t.name === options.assetCode && t.network === options.network,
    );
    if (trustline) {
      enhancedOptions.assetIssuer = trustline.address;
    }
  }

  // Rest of the function remains the same, but use enhancedOptions
  const availableEncodings = ENCODING_PRIORITY.filter((encoding) => {
    if (
      encoding === "freighter-intent" &&
      !FEATURE_FLAGS.ENABLE_FREIGHTER_INTENT
    ) {
      return false;
    }
    if (encoding === "lobstr-hint" && !FEATURE_FLAGS.ENABLE_LOBSTR_HINT) {
      return false;
    }
    return true;
  });

  for (const encoding of availableEncodings) {
    try {
      switch (encoding) {
        case "sep7-suggest":
          return generateSEP7Payload(enhancedOptions);
        case "freighter-intent":
          return generateFreighterPayload(enhancedOptions);
        case "lobstr-hint":
          return generateLobstrPayload(enhancedOptions);
        case "plain":
          return enhancedOptions.escrowAddress;
      }
    } catch {
      continue;
    }
  }

  return enhancedOptions.escrowAddress;
};

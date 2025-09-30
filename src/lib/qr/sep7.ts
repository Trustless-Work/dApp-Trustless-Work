import { PayloadOptions, MAX_QR_PAYLOAD_LENGTH } from "./qr";
import {
  validateContractAddress,
  validateAmount,
  validateAsset,
} from "./validations";

/**
 * Generates a SEP-7 compliant payment URI for Stellar transactions.
 *
 * SEP-7 (Stellar Ecosystem Proposal 7) defines a standard URI scheme for requesting
 * Stellar payments that can be encoded in QR codes and scanned by compatible wallets.
 *
 *
 * @param {PayloadOptions} options - The payment parameters
 * @param {string} options.escrowAddress - Destination address (currently validates as contract address C...)
 * @param {"testnet" | "mainnet"} options.network - Network for asset validation
 * @param {string} [options.assetCode] - Optional. Asset code (e.g., "USDC", "EURC", "XLM")
 * @param {string} [options.assetIssuer] - Optional. Asset issuer address (required for non-XLM assets)
 * @param {string} [options.amount] - Optional. Payment amount in human-readable format (e.g., "100.50")
 *
 * @returns {string} SEP-7 formatted URI string ready for QR encoding
 *
 * @throws {Error} If escrow address is not a valid contract address (may be too restrictive for SEP-7)
 * @throws {Error} If amount format is invalid (negative, too many decimals, exceeds max)
 * @throws {Error} If asset is not found in trustlines configuration
 * @throws {Error} If asset issuer is missing for non-XLM assets
 * @throws {Error} If asset issuer doesn't match trustline configuration
 * @throws {Error} If generated URI exceeds QR code size limit (2953 characters)
 *
 * @example
 * // XLM payment (works correctly)
 * generateSEP7Payload({
 *   escrowAddress: "CCTKDUS5GEXMOAWTVIEHSQHESYGHVAVPSEACUO5EM2RUGI7OC2EHY63V",
 *   network: "testnet",
 *   amount: "100"
 * });
 * // Returns: "web+stellar:pay?destination=CCTK...&amount=100"
 *
 * @example
 * // USDC payment (currently fails due to issuer mismatch)
 * generateSEP7Payload({
 *   escrowAddress: "CCTKDUS5GEXMOAWTVIEHSQHESYGHVAVPSEACUO5EM2RUGI7OC2EHY63V",
 *   network: "testnet",
 *   assetCode: "USDC",
 *   assetIssuer: "GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5", // Correct issuer
 *   amount: "50.25"
 * });
 * // Currently throws error because issuer doesn't match trustlines config
 *
 * @todo Update trustlines to differentiate between Soroban token contracts and SEP-7 asset issuers
 * @todo Consider separate validation logic for SEP-7 vs Soroban intents
 * @todo Test with GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5 as USDC issuer
 * @todo Review if contract addresses (C...) should be valid SEP-7 destinations
 */
export const generateSEP7Payload = (options: PayloadOptions): string => {
  const { escrowAddress, network, assetCode, assetIssuer, amount } = options;
  const params = new URLSearchParams();

  // Validate escrow address
  const addressValidation = validateContractAddress(escrowAddress);
  if (!addressValidation.isValid) {
    throw new Error(addressValidation.error);
  }
  params.append("destination", escrowAddress.trim());

  // Validate amount if provided
  if (amount) {
    const amountValidation = validateAmount(amount);
    if (!amountValidation.isValid) {
      throw new Error(`Invalid amount: ${amountValidation.error}`);
    }
    params.append("amount", amount);
  }

  // Validate asset (network + assetCode + assetIssuer together)
  const assetValidation = validateAsset(network, assetCode, assetIssuer);
  if (!assetValidation.isValid) {
    throw new Error(assetValidation.error);
  }

  // Add asset params if valid and not XLM
  if (assetCode && assetCode !== "XLM") {
    params.append("asset_code", assetCode);
    params.append("asset_issuer", assetIssuer!);
  }

  const uri = `web+stellar:pay?${params.toString()}`;

  if (uri.length > MAX_QR_PAYLOAD_LENGTH) {
    throw new Error("SEP-7 URI too long for QR code");
  }

  return uri;
};

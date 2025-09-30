import { PayloadOptions, FEATURE_FLAGS, MAX_QR_PAYLOAD_LENGTH } from "./qr";

/**
 * Generates a Lobstr wallet deep link for Stellar payments.
 * NOTE:Lobst wallet does not have it's own format as per my research. If they release one, then the logic can be written here.
 *
 * @param {PayloadOptions} options - Payment configuration
 * @param {string} options.escrowAddress - Destination address for the payment
 * @param {"testnet" | "mainnet"} options.network - Network (currently not used in deep link)
 * @param {string} [options.assetCode] - Asset code (defaults to XLM if not provided)
 * @param {string} [options.assetIssuer] - Asset issuer (required for non-XLM assets)
 * @param {string} [options.amount] - Payment amount in human-readable format
 *
 * @returns {string} Lobstr deep link URL ready for QR encoding
 *
 * @throws {Error} If Lobstr hint encoding is disabled via feature flag
 * @throws {Error} If non-XLM asset is specified without an issuer
 * @throws {Error} If generated deep link exceeds QR code size limit
 *
 * @example
 * // XLM payment
 * generateLobstrPayload({
 *   escrowAddress: "GABC...",
 *   network: "testnet",
 *   amount: "100"
 * });
 * // Returns: "lobstr://send?destination=GABC...&asset_type=native&amount=100"
 *
 * @example
 * // USDC payment
 * generateLobstrPayload({
 *   escrowAddress: "CCTKD...",
 *   network: "testnet",
 *   assetCode: "USDC",
 *   assetIssuer: "GBBD...",
 *   amount: "50.25"
 * });
 * // Returns: "lobstr://send?destination=CCTKD...&asset_code=USDC&asset_issuer=GBBD...&amount=50.25"
 */
export const generateLobstrPayload = (options: PayloadOptions): string => {
  const { escrowAddress, assetCode, assetIssuer, amount } = options;

  // Check if feature is enabled
  if (!FEATURE_FLAGS.ENABLE_LOBSTR_HINT) {
    throw new Error("Lobstr hint encoding is disabled");
  }

  // Build query parameters
  const params = new URLSearchParams();
  params.append("destination", escrowAddress);

  // Handle asset configuration
  if (assetCode && assetCode !== "XLM") {
    // Non-native asset
    if (!assetIssuer) {
      throw new Error(`Lobstr requires issuer for ${assetCode}`);
    }
    params.append("asset_code", assetCode);
    params.append("asset_issuer", assetIssuer);
  } else {
    // Native XLM or no asset specified
    params.append("asset_type", "native");
  }

  // Add amount if provided and valid
  if (amount && parseFloat(amount) > 0) {
    params.append("amount", amount);
  }

  // Construct deep link
  const deepLink = `lobstr://send?${params.toString()}`;

  // Validate size for QR encoding
  if (deepLink.length > MAX_QR_PAYLOAD_LENGTH) {
    throw new Error("Lobstr deep link URI too long for QR code");
  }

  return deepLink;
};

import { PayloadOptions } from "./qr";
import { trustlines } from "@/constants/trustlines.constant";
import {
  validateContractAddress,
  validateAmount,
  validateAssetCode,
} from "./validations";
import {
  Account,
  TransactionBuilder,
  Networks,
  Address,
  Contract,
  nativeToScVal,
  BASE_FEE,
} from "@stellar/stellar-sdk";

/**
 * Generates a Freighter wallet-compatible transaction XDR payload for Soroban token transfers.
 *
 * This function builds an unsigned Soroban transaction that invokes the transfer function
 * on a token contract to move tokens from the user's wallet to an escrow contract address.
 *
 * **Transaction Structure:**
 * - Uses a placeholder account that will be replaced by the wallet
 * - Calls the `transfer` method on the token contract
 * - From: Placeholder address (replaced by user's address when signing)
 * - To: The escrow contract address
 * - Amount: Converted to stroops (7 decimal places)
 *
 * @param {PayloadOptions} options - The transaction parameters
 * @param {string} options.escrowAddress - The destination Soroban contract address (must start with 'C')
 * @param {"testnet" | "mainnet"} options.network - The Stellar network to use
 * @param {string} options.assetCode - Required. The asset code (e.g., "USDC", "EURC")
 * @param {string} [options.amount] - Optional. The amount to transfer in human-readable format (e.g., "100.50")
 *
 * @returns {string} Base64-encoded XDR of the unsigned transaction
 *
 * @throws {Error} If escrow address is not a valid contract address
 * @throws {Error} If asset code is not provided (required for Soroban transfers)
 * @throws {Error} If asset is XLM (not supported for contract transfers)
 * @throws {Error} If asset is not found in trustlines configuration
 * @throws {Error} If amount format is invalid (when provided)
 * @throws {Error} If generated XDR exceeds QR code size limit (2953 characters)
 *
 * @example
 * const xdr = generateFreighterPayload({
 *   escrowAddress: "CCTKDUS5GEXMOAWTVIEHSQHESYGHVAVPSEACUO5EM2RUGI7OC2EHY63V",
 *   network: "testnet",
 *   assetCode: "USDC",
 *   amount: "100"
 * });
 * // Returns: Base64-encoded XDR string for QR code
 *
 * @todo Update testnet USDC configuration to use a proper Soroban token contract address
 * @todo Add support for custom token contracts not in trustlines
 */
const generateFreighterPayload = (options: PayloadOptions): string => {
  const { escrowAddress, network, assetCode, amount } = options;

  // Validate contract address first
  const addressValidation = validateContractAddress(escrowAddress);
  if (!addressValidation.isValid) {
    throw new Error(addressValidation.error);
  }

  // Validate amount if provided
  if (amount) {
    const amountValidation = validateAmount(amount);
    if (!amountValidation.isValid) {
      throw new Error(`Invalid amount: ${amountValidation.error}`);
    }
  }

  // For Soroban, asset is REQUIRED
  if (!assetCode) {
    throw new Error("Asset code is required for Freighter intent");
  }

  if (assetCode === "XLM") {
    throw new Error("XLM not supported for contract transfers");
  }

  // Validate asset exists in trustlines
  const assetValidation = validateAssetCode(assetCode, network);
  if (!assetValidation.isValid) {
    throw new Error(assetValidation.error);
  }

  // Get the token contract address from trustlines
  const trustline = trustlines.find(
    (t) => t.name === assetCode && t.network === network,
  );

  if (!trustline) {
    // This shouldn't happen after validation, but TypeScript needs it
    throw new Error(`${assetCode} configuration not found`);
  }

  const tokenContractAddress = trustline.address;
  const networkPassphrase =
    network === "mainnet" ? Networks.PUBLIC : Networks.TESTNET;

  // Create a placeholder account with sequence 0
  const placeholderAccount = new Account(
    "GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEITLQ", //Placeholder address
    "0",
  );

  // Build the transaction
  const transactionBuilder = new TransactionBuilder(placeholderAccount, {
    fee: BASE_FEE,
    networkPassphrase,
  });

  // Build transfer operation
  const fromAddress = Address.fromString(
    "GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEITLQ", //Placeholder address
  );
  const toAddress = Address.fromString(escrowAddress);

  const amountInStroops = amount
    ? Math.floor(parseFloat(amount) * 10000000).toString()
    : "0";

  const contract = new Contract(tokenContractAddress);

  const transferOp = contract.call(
    "transfer",
    nativeToScVal(fromAddress, { type: "address" }),
    nativeToScVal(toAddress, { type: "address" }),
    nativeToScVal(amountInStroops, { type: "i128" }),
  );

  transactionBuilder.addOperation(transferOp);
  transactionBuilder.setTimeout(300);

  const transaction = transactionBuilder.build();
  const xdr = transaction.toXDR();

  if (xdr.length > 2953) {
    // MAX_QR_PAYLOAD_LENGTH
    throw new Error("Transaction XDR too long for QR code");
  }

  return xdr;
};

export { generateFreighterPayload };

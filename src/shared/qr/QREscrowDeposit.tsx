/**
 * @fileoverview QR Code Component for Stellar Escrow Deposits
 *
 * This component generates QR codes for depositing funds to Stellar escrow contracts.
 * It supports multiple encoding strategies for different wallets and provides
 * visual feedback about network, encoding type, and potential compatibility issues.
 *
 * @module shared/qr/QREscrowDeposit
 */

import React, { useState, useMemo } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Copy, Check, AlertCircle, Info } from "lucide-react";
import { Button } from "@/ui/button";
import { Badge } from "@/ui/badge";
import { generateQRPayload, EncodingStrategy } from "@/lib/qr/qr";
import { validateContractAddress } from "@/lib/qr/validations";
import { formatAddress } from "@/lib/format";

/**
 * Props for the QREscrowDeposit component.
 *
 * @interface QREscrowDepositProps
 *
 * @property {string} escrowAddress - The Soroban contract address to receive deposits (must start with 'C')
 * @property {"testnet" | "mainnet"} network - The Stellar network for the transaction
 * @property {string} [assetCode] - Optional. Asset to deposit (e.g., "USDC", "EURC", "XLM")
 * @property {string} [amount] - Optional. Amount to deposit in human-readable format (e.g., "100.50")
 * @property {EncodingStrategy} [encoding="auto"] - Optional. QR encoding strategy to use
 * @property {number} [size=220] - Optional. QR code size in pixels (100-400 recommended)
 * @property {boolean} [caption=true] - Optional. Whether to show caption with address and details
 */
export interface QREscrowDepositProps {
  escrowAddress: string;
  network: "testnet" | "mainnet";
  assetCode?: string;
  amount?: string;
  encoding?: EncodingStrategy;
  size?: number;
  caption?: boolean;
}

/**
 * QR Code component for Stellar escrow deposits with multi-wallet support.
 *
 * This component generates QR codes that can be scanned by Stellar wallets to
 * initiate deposits to escrow contracts. It intelligently handles different
 * encoding strategies and provides appropriate warnings for compatibility issues.
 *
 * **Features:**
 * - Multiple encoding strategies (SEP-7, Freighter Intent, Lobstr Hint, Plain)
 * - Smart fallback mechanism for maximum compatibility
 * - Visual network indicator (Testnet/Mainnet badges)
 * - Copy-to-clipboard functionality for addresses
 * - Contextual warnings for experimental features
 * - Error handling with graceful degradation
 *
 * **Known Limitations:**
 * - Asset issuer is not passed to generateQRPayload (causes SEP-7 failures for non-XLM)
 * - Freighter Intent requires proper token contract addresses in trustlines
 * - Lobstr deep links are experimental and may not work consistently
 *
 * **Fallback Behavior:**
 * - In auto mode: Always returns a scannable QR code, falling back to plain address
 * - In specific modes: Shows error with plain address fallback if encoding fails
 *
 * @component
 *
 * @param {QREscrowDepositProps} props - Component configuration
 * @returns {React.ReactElement} Rendered QR code with optional caption and warnings
 *
 * @example
 * // Basic usage with auto-encoding
 * <QREscrowDeposit
 *   escrowAddress="CCTKDUS5GEXMOAWTVIEHSQHESYGHVAVPSEACUO5EM2RUGI7OC2EHY63V"
 *   network="testnet"
 *   assetCode="USDC"
 *   amount="100"
 * />
 *
 * @example
 * // Force SEP-7 encoding with custom size
 * <QREscrowDeposit
 *   escrowAddress="CCTKDUS5GEXMOAWTVIEHSQHESYGHVAVPSEACUO5EM2RUGI7OC2EHY63V"
 *   network="mainnet"
 *   assetCode="XLM"
 *   amount="50.25"
 *   encoding="sep7-suggest"
 *   size={300}
 *   caption={true}
 * />
 *
 * @example
 * // Minimal QR without caption
 * <QREscrowDeposit
 *   escrowAddress="CCTKDUS5GEXMOAWTVIEHSQHESYGHVAVPSEACUO5EM2RUGI7OC2EHY63V"
 *   network="testnet"
 *   encoding="plain"
 *   caption={false}
 * />
 *
 * @todo Add assetIssuer prop and pass it to generateQRPayload for SEP-7 compatibility
 * @todo Implement automatic issuer lookup from trustlines when not provided
 * @todo Add support for memo and message fields
 */
export const QREscrowDeposit: React.FC<QREscrowDepositProps> = ({
  escrowAddress,
  network,
  assetCode,
  amount,
  encoding = "auto",
  size = 220,
  caption = true,
}) => {
  /**
   * State for copy-to-clipboard success feedback
   * @type {[boolean, Function]}
   */
  const [copySuccess, setCopySuccess] = useState(false);

  /**
   * Validates the escrow address format.
   * Must be a valid Soroban contract address starting with 'C'.
   */
  const validation = validateContractAddress(escrowAddress);

  /**
   * Generates the QR payload with error handling and contextual warnings.
   *
   * This memoized computation:
   * 1. Validates the escrow address
   * 2. Attempts to generate payload using specified encoding
   * 3. Provides contextual warnings based on encoding type
   * 4. Falls back to plain address on error (in auto mode)
   *
   * @returns {{payload: string, error?: string, warning?: string}}
   */
  const { payload, error, warning } = useMemo(() => {
    if (!validation.isValid) {
      return {
        payload: "",
        error: validation.error,
        warning: undefined,
      };
    }

    try {
      const generatedPayload = generateQRPayload({
        escrowAddress,
        network,
        assetCode,
        amount,
        encoding,
        // NOTE: assetIssuer is not passed here, causing SEP-7 validation failures
      });

      // Add contextual warnings based on encoding
      let contextWarning: string | undefined;

      if (encoding === "freighter-intent") {
        contextWarning =
          "Freighter mobile may not support contract QR codes yet";
      } else if (encoding === "lobstr-hint") {
        contextWarning = "Lobstr deep link support is experimental";
      } else if (encoding === "auto" && generatedPayload === escrowAddress) {
        contextWarning =
          "Using plain address format (enhanced formats unavailable)";
      }

      return {
        payload: generatedPayload,
        error: undefined,
        warning: contextWarning,
      };
    } catch (err) {
      // For non-auto modes, show the specific error
      if (encoding !== "auto") {
        return {
          payload: escrowAddress, // Fallback to plain address
          error:
            err instanceof Error ? err.message : "Failed to generate QR code",
          warning: "Showing plain address as fallback",
        };
      }

      // Auto mode should never fail (it has fallbacks)
      return {
        payload: escrowAddress,
        error: undefined,
        warning: "Using plain address format",
      };
    }
  }, [escrowAddress, network, assetCode, amount, encoding, validation]);

  /**
   * Handles copying the escrow address to clipboard.
   * Shows temporary success feedback when successful.
   *
   * @async
   * @returns {Promise<void>}
   */
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(escrowAddress);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  /**
   * Error state rendering for non-auto encoding modes.
   * Shows error message with optional warning about fallback.
   */
  if (error && encoding !== "auto") {
    return (
      <div className="flex flex-col items-center gap-3 p-6">
        <AlertCircle className="h-8 w-8 text-red-500" />
        <div className="text-red-500 text-sm text-center max-w-xs">{error}</div>
        {warning && (
          <div className="text-gray-500 text-xs text-center">{warning}</div>
        )}
      </div>
    );
  }

  /**
   * Main component rendering with QR code and optional elements
   */
  return (
    <div className="flex flex-col items-center gap-4 p-6">
      {/* Network Badge - Visual indicator for testnet/mainnet */}
      <Badge variant={network === "testnet" ? "secondary" : "default"}>
        {network === "testnet" ? "Testnet" : "Mainnet"}
      </Badge>

      {/* Encoding indicator - Shows which encoding is being used (except auto/plain) */}
      {encoding !== "auto" && encoding !== "plain" && (
        <Badge variant="outline" className="text-xs">
          {encoding.replace("-", " ").toUpperCase()}
        </Badge>
      )}

      {/* Warning/Info messages - Contextual information about compatibility */}
      {warning && (
        <div className="flex items-center gap-2 px-3 py-2 bg-yellow-50 border border-yellow-200 rounded-md text-xs max-w-xs">
          <Info className="h-3 w-3 text-yellow-600 flex-shrink-0" />
          <span className="text-yellow-800">{warning}</span>
        </div>
      )}

      {/* QR Code - The main scannable element */}
      <div className="p-4 bg-white rounded-lg shadow-sm border">
        <QRCodeSVG
          value={payload}
          size={size}
          level="M" // Medium error correction level
        />
      </div>

      {/* Caption - Optional details section */}
      {caption && (
        <div className="flex flex-col items-center gap-2 text-center">
          {/* Escrow Address with copy button */}
          <div className="flex items-center gap-2">
            <div className="text-sm text-muted-foreground">
              <span className="font-medium">Escrow:</span>{" "}
              <code className="font-mono text-xs">
                {formatAddress(escrowAddress, 4)}
              </code>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopy}
              className="h-6 w-6"
              title="Copy full address"
            >
              {copySuccess ? (
                <Check className="h-3 w-3 text-green-600" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </Button>
          </div>

          {/* Asset and Amount display */}
          <div className="flex gap-4 text-sm text-muted-foreground">
            {assetCode && (
              <div>
                <span className="font-medium">Asset:</span> {assetCode}
              </div>
            )}
            {amount && (
              <div>
                <span className="font-medium">Amount:</span> {amount}
              </div>
            )}
          </div>

          {/* Scan instruction */}
          <div className="text-xs text-gray-400 mt-2">
            Scan with your Stellar wallet to deposit
          </div>
        </div>
      )}
    </div>
  );
};

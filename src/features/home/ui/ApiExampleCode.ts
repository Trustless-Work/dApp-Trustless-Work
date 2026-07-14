export const codeExamples = {
  rest: `// Initialize API client (Core v2)
const API_BASE_URL = 'https://trustless-core-production.up.railway.app';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || "";

const headers = {
  'Content-Type': 'application/json',
  "x-api-key": your_api_key,
};

// Example: Fund Escrow (build unsigned XDR)
const fundEscrow = async (contractId, signer, amount) => {
  try {
    const response = await fetch(
      \`\${API_BASE_URL}/escrow/single-release/v2/fund\`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify({
          contractId,
          signer,
          amount
        })
      }
    );

    const data = await response.json();
    // { unsignedXdr, txHash }
    return data;
  } catch (error) {
    console.error('Error funding escrow:', error);
  }
};`,

  provider: `// Provider Configuration
"use client";

import React from "react";
import {
  development,
  mainNet,
  TrustlessWorkConfig,
} from "@trustless-work/escrow";

export function TrustlessWorkProvider({ children }) {
  const apiKey = process.env.NEXT_PUBLIC_API_KEY || "";

  return (
    <TrustlessWorkConfig baseURL={development} apiKey={apiKey}>
      {children}
    </TrustlessWorkConfig>
  );
}`,

  react: `// Usage Example (SDK v5)
import { useFundEscrow, useSendTransaction } from "@trustless-work/escrow";
import type { FundEscrowPayload } from "@trustless-work/escrow/types";

export const FundEscrowComponent = () => {
  const { fundEscrow } = useFundEscrow();
  const { sendTransaction } = useSendTransaction();

  const onSubmit = async (payload: FundEscrowPayload) => {
    try {
      const { unsignedXdr } = await fundEscrow(payload, "single-release");

      if (!unsignedXdr) {
        throw new Error("Unsigned XDR missing from fundEscrow response.");
      }

      const signedXdr = await signTransaction({
        unsignedTransaction: unsignedXdr,
        address: walletAddress || "",
      });

      const data = await sendTransaction(signedXdr);
      // { txHash, ledger, contractId?, escrow?, code? }
      console.log(data.txHash);
    } catch (error: unknown) {
      // Handle error
    }
  };
};`,
};

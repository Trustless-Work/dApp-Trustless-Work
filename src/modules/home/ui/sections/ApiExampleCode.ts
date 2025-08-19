export const codeExamples = {
  rest: `// Initialize API client
const API_BASE_URL = 'https://api.trustlesswork.com'; // Mainnet
// const API_BASE_URL = 'https://api.dev.trustlesswork.com'; // Testnet
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || "";

const headers = {
  'Content-Type': 'application/json',
  'Authorization': \`Bearer \${API_KEY}\`
};

// Example: Fund Escrow
const fundEscrow = async (contractId, signer, amount) => {
  try {
    const response = await fetch(\`\${API_BASE_URL}/escrow/single-release/fund-escrow\`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        contractId,
        signer,
        amount
      })
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error funding escrow:', error);
  }
};`,

  provider: `// Provider Configuration
"use client";

import React from "react";
import {
  development, // Testnet: "https://api.dev.trustlesswork.com"
  mainNet,     // Mainnet: "https://api.trustlesswork.com"
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

  react: `// Usage Example
import { useFundEscrow, useSendTransaction } from "@trustless-work/escrow";
import {
  FundEscrowPayload,
} from "@trustless-work/escrow/types";

export const FundEscrowComponent = () => {
  const { fundEscrow } = useFundEscrow();
  const { sendTransaction } = useSendTransaction();

  const onSubmit = async (payload: FundEscrowPayload) => {
    try {
      const { unsignedTransaction } = await fundEscrow(
        payload,
        "single-release",
        // or "multi-release"
      );

      if (!unsignedTransaction) {
        throw new Error(
          "Unsigned transaction is missing from fundEscrow response."
        );
      }

      // Sign the transaction
      const signedXdr = await signTransaction({
        unsignedTransaction,
        address: walletAddress || "",
      });

      if (!signedXdr) {
        throw new Error("Signed transaction is missing.");
      }

      const data = await sendTransaction(signedXdr);

      if (data.status === "SUCCESS" && escrow) {
        // Handle success
      }
    } catch (error: unknown) {
      // Handle error
    }
  }
};`,
};

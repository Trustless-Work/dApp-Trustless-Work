"use client";

import type {
  EscrowRequestResponse,
  SendTransactionResponse,
} from "@trustless-work/escrow";
import { useSendTransaction } from "@trustless-work/escrow";
import { useCallback, useState } from "react";
import { signTransaction } from "@/components/tw-blocks/wallet-kit/wallet-kit";
import { useWalletContext } from "@/providers/WalletProvider";

export function useSignAndSend() {
  const { walletAddress } = useWalletContext();
  const { sendTransaction } = useSendTransaction();
  const [loading, setLoading] = useState(false);

  const signAndSend = useCallback(
    async (
      buildTx: () => Promise<EscrowRequestResponse>,
    ): Promise<SendTransactionResponse> => {
      if (!walletAddress) {
        throw new Error("Connect your wallet to continue.");
      }

      setLoading(true);

      try {
        const { unsignedXdr } = await buildTx();
        const signedXdr = await signTransaction({
          unsignedTransaction: unsignedXdr,
          address: walletAddress,
        });

        return await sendTransaction(signedXdr);
      } finally {
        setLoading(false);
      }
    },
    [sendTransaction, walletAddress],
  );

  return {
    signAndSend,
    loading,
    walletAddress,
  };
}

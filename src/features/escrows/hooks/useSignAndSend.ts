"use client";

import type {
  BuildTransactionResponse,
  DeployEscrowResponse,
  SendTransactionResponse,
} from "@trustless-work/escrow";
import { useSendTransaction } from "@trustless-work/escrow";
import { useCallback, useState } from "react";
import { signTransaction } from "@/components/tw-blocks/wallet-kit/wallet-kit";
import { useWalletContext } from "@/providers/WalletProvider";

type BuildTxResult = BuildTransactionResponse | DeployEscrowResponse;

export function useSignAndSend() {
  const { walletAddress } = useWalletContext();
  const { sendTransaction } = useSendTransaction();
  const [loading, setLoading] = useState(false);

  const signAndSend = useCallback(
    async (
      buildTx: () => Promise<BuildTxResult>,
    ): Promise<SendTransactionResponse> => {
      if (!walletAddress) {
        throw new Error("Connect your wallet to continue.");
      }

      setLoading(true);

      try {
        const buildResult = await buildTx();
        const signedXdr = await signTransaction({
          unsignedTransaction: buildResult.unsignedXdr,
          address: walletAddress,
        });

        const sendResult = await sendTransaction(signedXdr);
        const buildContractId =
          "contractId" in buildResult ? buildResult.contractId : undefined;

        return {
          ...sendResult,
          contractId: sendResult.contractId ?? buildContractId,
        };
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

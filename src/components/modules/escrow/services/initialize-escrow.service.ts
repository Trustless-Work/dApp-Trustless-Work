/* eslint-disable @typescript-eslint/no-explicit-any */

import { EscrowPayload } from "@/@types/escrow.entity";
import http from "@/core/config/axios/http";
import { WalletNetwork } from "@creit.tech/stellar-wallets-kit";
import { signTransaction } from "@stellar/freighter-api";
import axios from "axios";

interface EscrowPayloadWithSigner extends EscrowPayload {
  signer?: string;
  trustlineDecimals: number | undefined;
}

export const initializeEscrow = async (
  payload: EscrowPayloadWithSigner,
  address: string,
) => {
  try {
    const payloadWithSigner: EscrowPayloadWithSigner = {
      ...payload,
      signer: address,
    };

    const response = await http.post(
      "/deployer/invoke-deployer-contract",
      payloadWithSigner,
    );

    const { unsignedTransaction } = response.data;

    const { signedTxXdr } = await signTransaction(unsignedTransaction, {
      address,
      networkPassphrase: WalletNetwork.TESTNET,
    });

    const tx = await http.post("/helper/send-transaction", {
      signedXdr: signedTxXdr,
      returnEscrowDataIsRequired: true,
    });

    const { data } = tx;

    return data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Axios Error:", error.response?.data || error.message);
      throw new Error(
        error.response?.data?.message || "Error initializing escrow",
      );
    } else {
      console.error("Unexpected Error:", error);
      throw new Error("Unexpected error occurred");
    }
  }
};

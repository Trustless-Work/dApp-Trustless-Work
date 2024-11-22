import { kit } from "@/wallet/walletKit";
import { WalletNetwork } from "@creit.tech/stellar-wallets-kit";
import { signTransaction } from "@stellar/freighter-api";
import http from "@/core/axios/http";
import axios from "axios";

interface EscrowPayload {
  contractId: string;
  engagementId: string;
  serviceProvider: string;
}

export const claimEscrowEarnings = async (payload: EscrowPayload) => {
  try {
    const response = await http.post("/escrow/claim-escrow-earnings", payload);
    const { unsignedTransaction } = response.data;
    const { address } = await kit.getAddress();
    const { signedTxXdr } = await signTransaction(unsignedTransaction, {
      address,
      networkPassphrase: WalletNetwork.TESTNET,
    });
    const tx = await http.post("/helper/send-transaction", {
      signedXdr: signedTxXdr,
    });
    const { data } = tx;
    return data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Axios Error:", error.response?.data || error.message);
      throw new Error(
        error.response?.data?.message || "Error in Axios request",
      );
    } else {
      console.error("Unexpected Error:", error);
      throw new Error("Unexpected error occurred");
    }
  }
};

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

export const cancelEscrow = async (payload: EscrowPayload): Promise<any> => {
  try {
    const response = await http.post("/escrow/cancel-escrow", payload);
    const { unsignedTransaction } = response.data;

    const addressData = await kit.getAddress();
    const { address } = addressData;

    const signedTransactionData = await signTransaction(unsignedTransaction, {
      address,
      networkPassphrase: WalletNetwork.TESTNET,
    });
    const { signedTxXdr } = signedTransactionData;

    const txResponse = await http.post("/helper/send-transaction", {
      signedXdr: signedTxXdr,
    });
    const { data } = txResponse;

    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios Error:", error.message);
      throw error;
    } else {
      console.error("Unexpected Error:", error);
      throw new Error("Unexpected error occurred");
    }
  }
};

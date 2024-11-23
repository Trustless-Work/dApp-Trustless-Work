import axios from "axios";
import { kit } from "@/wallet/walletKit";
import { WalletNetwork } from "@creit.tech/stellar-wallets-kit";
import { signTransaction } from "@stellar/freighter-api";
import http from "@/core/axios/http";

interface EscrowPayload {
  contractId: string;
  engagementId: string;
  serviceProvider: string;
}

export const cancelEscrow = async (payload: EscrowPayload) => {
  try {
    const response = await http.post("/escrow/cancel-escrow", payload);
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
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error:", error.message);
      throw error;
    } else {
      console.error("Error:", error);
      throw new Error("Error");
    }
  }
};

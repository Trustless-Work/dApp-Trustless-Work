import axios from "axios";
import { kit } from "@/wallet/walletKit";
import { WalletNetwork } from "@creit.tech/stellar-wallets-kit";
import {
  signTransaction,
} from "@stellar/freighter-api";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface EscrowPayload {
  contractId: string;
  engagementId: string;
  serviceProvider: string;
}

export const claimEscrowEarnings = async (payload: EscrowPayload) => {
  try {
    const response = await axios.post(
      `${API_URL}/escrow/claim-escrow-earnings`,
      payload
    );

    const { unsignedTransaction } = response.data
    const { address } = await kit.getAddress()
    const { signedTxXdr } = await signTransaction(unsignedTransaction, {
      address,
      networkPassphrase: WalletNetwork.TESTNET,
    })

    const tx = await axios.post(
      `${API_URL}/helper/send-transaction`,
      {
        signedXdr: signedTxXdr
      }
    );
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

import { kit } from "@/wallet/walletKit";
import { WalletNetwork } from "@creit.tech/stellar-wallets-kit";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface EscrowPayload {
  engagementId: string;
  description: string;
  serviceProvider: string;
  amount: string;
  signer: string;
}

export const initializeEscrow = async (payload: EscrowPayload) => {
  try {
    const response = await axios.post(
      `${API_URL}/deployer/invoke-deployer-contract`,
      payload
    );
    // const { address } = await kit.getAddress();
    // const { signedTxXdr } = await kit.signTransaction(response.data, {
    //   address,
    //   networkPassphrase: WalletNetwork.TESTNET,
    // });
    // const tx = await axios.post(`${API_URL}/helper/send-transaction`, {
    //   signedXdr: signedTxXdr,
    // });
    // const { data } = tx;
    return response.data;
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

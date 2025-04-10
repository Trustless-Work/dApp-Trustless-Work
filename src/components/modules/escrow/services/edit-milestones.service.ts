import { EditMilestonesPayload } from "@/@types/escrow.entity";
import http from "@/core/config/axios/http";
import { kit } from "@/components/modules/auth/wallet/constants/wallet-kit.constant";
import axios from "axios";
import { signTransaction } from "@/lib/stellar-wallet-kit";

export const editMilestones = async (payload: EditMilestonesPayload) => {
  try {
    const { address } = await kit.getAddress();

    const response = await http.put(
      "/escrow/update-escrow-by-contract-id",
      payload,
    );
    const { unsignedTransaction } = response.data;

    const signedTxXdr = await signTransaction({ unsignedTransaction, address });

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

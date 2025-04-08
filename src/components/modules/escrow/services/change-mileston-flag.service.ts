import { ChangeMilestoneFlagPayload } from "@/@types/escrow.entity";
import http from "@/core/config/axios/http";
import { kit } from "@/components/modules/auth/wallet/constants/wallet-kit.constant";
import axios from "axios";
import { sendTransaction, signTransaction } from "@/lib/stellar-wallet-kit";

export const changeMilestoneFlag = async (
  payload: ChangeMilestoneFlagPayload,
) => {
  try {
    const { address } = await kit.getAddress();

    const response = await http.post(
      "/escrow/change-milestone-approved-flag",
      payload,
    );
    const { unsignedTransaction } = response.data;

    const signedTxXdr = await signTransaction({ unsignedTransaction, address });

    const { data } = await sendTransaction({
      signedXdr: signedTxXdr,
      returnEscrowDataIsRequired: true,
    });

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

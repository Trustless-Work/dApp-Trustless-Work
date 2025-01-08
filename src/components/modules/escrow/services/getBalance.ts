import http from "@/core/config/axios/http";
import axios from "axios";

export const getBalance = async (
  contractId: string | undefined,
  address: string,
) => {
  try {
    const response = await http.get("/helper/get-escrow-balance", {
      params: { contractId, signer: address },
    });

    return response;
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

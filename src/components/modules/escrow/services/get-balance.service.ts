import http from "@/core/config/axios/http";
import axios from "axios";

export const getBalance = async (signer: string, addresses: string[]) => {
  try {
    const response = await http.get("/helper/get-multiple-escrow-balance", {
      params: { addresses, signer },
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

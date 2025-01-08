import http from "@/core/config/axios/http";
import axios from "axios";

export const getBalance = async (contractId: string, address: string) => {
  try {
    console.log({ object: { contractId, address } });

    const response = await http.get("/helper/get-escrow-balance", {
      params: { contractId, signer: address },
    });

    const { balance } = response.data;
    console.log("Balance:", balance, "Address:", address);

    return { balance };
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

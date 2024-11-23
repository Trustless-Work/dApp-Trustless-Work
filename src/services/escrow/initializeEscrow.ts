import http from "@/core/axios/http";
import axios from "axios";

interface EscrowPayload {
  client: string;
  serviceProvider: string;
  platformAddress: string;
  amount: string;
  releaseSigner: string;
  milestones: {
    description: string;
    status: string;
  }[];
  signer: string;
}

export const initializeEscrow = async (payload: EscrowPayload) => {
  try {
    const response = await http.post(
      "/deployer/invoke-deployer-contract",
      payload,
    );
    return response.data;
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

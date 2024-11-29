import http from "@/core/axios/http";
import axios from "axios";

interface EscrowPayload {
  contractId: string;
  engagementId: string;
}

export const getEngagement = async (payload: EscrowPayload) => {
  try {
    const { contractId, engagementId } = payload;
    const response = await http.get(
      `/escrow/get-escrow-by-engagement-id?contractId=${contractId}&engagementId=${engagementId}`,
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Axios Error:", error.response?.data || error.message);
      throw new Error(
        error.response?.data?.message || "Error fetching engagement details",
      );
    } else {
      console.error("Unexpected Error:", error);
      throw new Error("Unexpected error occurred");
    }
  }
};

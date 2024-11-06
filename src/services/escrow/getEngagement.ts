import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface EscrowPayload {
  contractId: string;
  engagementId: string;
}

export const getEngagement = async (payload: EscrowPayload) => {
  try {
    const { contractId, engagementId } = payload;
    const response = await axios.get(
      `${API_URL}/escrow/get-escrow-by-engagement-id?contractId=${contractId}&engagementId=${engagementId}`
    );
    return response;
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

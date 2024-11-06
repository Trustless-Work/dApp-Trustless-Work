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

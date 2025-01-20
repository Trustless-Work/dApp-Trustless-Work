import http from "@/core/config/axios/http";
import axios from "axios";

export const requestApiKey = async (wallet: string) => {
  try {
    const response = await http.post("/auth/request-api-key", { wallet });

    return response;
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

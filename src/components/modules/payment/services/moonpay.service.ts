import http from "@/core/config/axios/http";

interface MoonPayCallbackDataProps {
  status: string;
  contractId: string;
  engagementId: string;
  walletAddress: string;
  transactionId: string;
}

export const verifyMoonPayPayment = async (transactionId: string) => {
  try {
    const response = await http.get(
      `/api/verify-moonpay-txn?transactionId=${transactionId}`,
    );
    return response.data;
  } catch (error) {
    console.error("Error verifying MoonPay payment:", error);
    throw error;
  }
};

export const processPaymentCallback = async (
  data: MoonPayCallbackDataProps,
) => {
  try {
    const response = await http.post("/api/moonpay-callback", data);
    return response.data;
  } catch (error) {
    console.error("Error processing MoonPay callback:", error);
    throw error;
  }
};

export const verifyTransaction = async (transactionId: string) => {
  try {
    const response = await http.get(
      `https://api.moonpay.com/v1/transactions/${transactionId}`,
      {
        headers: {
          Authorization: `Api-Key ${process.env.MOONPAY_SECRET_KEY}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error verifying transaction:", error);
    throw error;
  }
};

import { useGlobalAuthenticationStore } from "@/core/store/data";

const MOONPAY_CONFIG = {
  apiKey: process.env.NEXT_PUBLIC_MOONPAY_API_KEY || "",
  baseUrl: "https://buy-staging.moonpay.com",
  currency: "usdc_xlm",
};

export const useGenerateMoonPayUrl = async (
  contractId: string,
  amount: number,
) => {
  const address = useGlobalAuthenticationStore((state) => state.address);

  const params = new URLSearchParams({
    apiKey: MOONPAY_CONFIG.apiKey,
    currencyCode: MOONPAY_CONFIG.currency,
    walletAddress: address,
    baseCurrencyAmount: amount.toString(),
    redirectURL: `${window.location.origin}/dashboard/escrow/fund-escrow/success?contractId=${contractId}`,
    failureRedirectURL: `${window.location.origin}/dashboard/escrow/fund-escrow/failure`,
  });

  return `${MOONPAY_CONFIG.baseUrl}?${params.toString()}`;
};

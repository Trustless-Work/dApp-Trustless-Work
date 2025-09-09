"use client";

import { useGlobalAuthenticationStore } from "@/store/data";
import { WalletBalance } from "./wallet-balance";

export const ResponsiveWalletBalance = () => {
  const { address } = useGlobalAuthenticationStore();

  if (!address) {
    return null;
  }

  // Desktop only: renders WalletBalance inline in header
  // Mobile variant is handled separately by MobileWalletBalance component
  return <WalletBalance />;
};

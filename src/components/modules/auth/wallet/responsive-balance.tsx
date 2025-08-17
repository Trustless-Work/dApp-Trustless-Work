"use client";

import { WalletBalance } from "./wallet-balance";
import { useGlobalAuthenticationStore } from "@/core/store/data";

export const ResponsiveWalletBalance = () => {
  const { address } = useGlobalAuthenticationStore();

  if (!address) {
    return null;
  }

  // Desktop only: renders WalletBalance inline in header
  // Mobile variant is handled separately by MobileWalletBalance component
  return <WalletBalance />;
};

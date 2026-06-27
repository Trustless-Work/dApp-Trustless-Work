"use client";

import { useWalletContext } from "@/providers/WalletProvider";
import { WalletBalance } from "./WalletBalance";

export const ResponsiveWalletBalance = () => {
  const { walletAddress } = useWalletContext();

  if (!walletAddress) {
    return null;
  }

  // Desktop only: renders WalletBalance inline in header
  // Mobile variant is handled separately by MobileWalletBalance component
  return <WalletBalance />;
};

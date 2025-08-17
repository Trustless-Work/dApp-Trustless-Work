"use client";

import { WalletBalance } from "./wallet-balance";
import { useGlobalAuthenticationStore } from "@/core/store/data";

export const MobileWalletBalance = () => {
  const { address } = useGlobalAuthenticationStore();

  if (!address) {
    return null;
  }

  return (
    <div className="md:hidden px-4 py-2 bg-muted/20 border-b border-border/50">
      <WalletBalance />
    </div>
  );
};

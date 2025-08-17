"use client";

import { WalletBalance } from "./wallet-balance";
import { useGlobalAuthenticationStore } from "@/core/store/data";
import useIsMobile from "@/hooks/mobile.hook";

export const MobileWalletBalance = () => {
  const { address } = useGlobalAuthenticationStore();
  const isMobile = useIsMobile();

  if (!address || !isMobile) {
    return null;
  }

  return (
    <div className="md:hidden px-4 py-2 bg-muted/20 border-b border-border/50">
      <WalletBalance />
    </div>
  );
};

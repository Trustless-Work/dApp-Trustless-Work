"use client";

import { useGlobalAuthenticationStore } from "@/store/data";
import { WalletBalance } from "./wallet-balance";
import useIsMobile from "@/hooks/useMobile";

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

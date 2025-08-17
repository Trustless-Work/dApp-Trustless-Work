"use client";

import { WalletBalance } from "./wallet-balance";
import { useGlobalAuthenticationStore } from "@/core/store/data";

interface ResponsiveWalletBalanceProps {
  variant?: "mobile" | "desktop";
}

export const ResponsiveWalletBalance = ({
  variant = "mobile",
}: ResponsiveWalletBalanceProps) => {
  const { address } = useGlobalAuthenticationStore();

  if (!address) {
    return null;
  }

  if (variant === "mobile") {
    return (
      <div className="md:hidden px-4 py-2 bg-muted/20 border-b border-border/50">
        <WalletBalance />
      </div>
    );
  }

  // Desktop version (for header)
  return (
    <div className="hidden md:block">
      <WalletBalance />
    </div>
  );
};

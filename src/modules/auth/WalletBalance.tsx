"use client";

import { useWalletBalance } from "./hooks/useWalletBalance";
import { cn } from "@/lib/utils";
import { useGlobalAuthenticationStore } from "@/store/data";
import { Button } from "@/ui/button";
import { Loader2, RefreshCw } from "lucide-react";

export const WalletBalance = () => {
  const { address } = useGlobalAuthenticationStore();
  const { balance, isLoading, refresh } = useWalletBalance();

  if (!address) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium">
        USDC{" "}
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin inline" />
        ) : (
          parseFloat(balance).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
        )}
      </span>
      <Button
        variant="ghost"
        size="sm"
        onClick={refresh}
        disabled={isLoading}
        className="h-6 w-6 p-0"
      >
        <RefreshCw className={cn("h-3 w-3", isLoading && "animate-spin")} />
      </Button>
    </div>
  );
};

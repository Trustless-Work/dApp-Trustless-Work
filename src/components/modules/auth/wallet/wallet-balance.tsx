"use client";

import { useWalletBalance } from "./hooks/useWalletBalance.hook";
import { useGlobalAuthenticationStore } from "@/core/store/data";
import { cn } from "@/lib/utils";
import { Loader2, Wallet, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const WalletBalance = () => {
  const { address } = useGlobalAuthenticationStore();
  const { balance, isLoading, error, refresh } = useWalletBalance();

  const currentNetwork =
    typeof window !== "undefined"
      ? localStorage.getItem("network") || "testnet"
      : "testnet";

  if (!address) {
    return (
      <div className="flex items-center gap-1.5 sm:gap-2 px-1.5 sm:px-2 py-1.5 sm:py-2 bg-muted/30 rounded-lg border border-dashed">
        <Wallet className="h-4 w-4 text-muted-foreground" />
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground">Connect wallet</span>
          <span className="text-xs text-muted-foreground/70 hidden sm:inline">
            to see balance
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex items-center justify-between gap-1 px-1.5 py-1.5 bg-muted/50 rounded-lg border min-w-0"
      role="region"
      aria-label="Wallet Balance"
    >
      <Wallet className="h-4 w-4 text-muted-foreground flex-shrink-0" />
      <div className="flex flex-col min-w-0">
        <div className="flex items-center gap-1">
          <span className="text-xs text-muted-foreground hidden sm:inline">
            Balance
          </span>
          <span className="text-xs text-muted-foreground sm:hidden">Bal</span>
          <Badge
            variant="outline"
            className="px-1 py-0 text-xs hidden sm:inline flex-shrink-0"
          >
            {currentNetwork}
          </Badge>
        </div>
        <span className="sr-only">Current wallet balance</span>
      </div>
      <div className="flex items-center gap-1 flex-shrink-0">
        {isLoading ? (
          <div className="flex items-center gap-1">
            <div className="h-3 w-8 bg-muted animate-pulse rounded" />
            <Badge variant="secondary" className="text-xs px-1 py-0">
              USDC
            </Badge>
            <Loader2 className="h-3 w-3 animate-spin text-muted-foreground ml-1" />
          </div>
        ) : error ? (
          <div className="flex flex-col">
            <span className="text-xs text-destructive">{error}</span>
            <span className="text-xs text-muted-foreground">Click refresh</span>
            {error && String(error).toLowerCase().includes("network error") && (
              <span className="text-xs text-muted-foreground">
                Check connection
              </span>
            )}
            {error &&
              String(error)
                .toLowerCase()
                .includes("failed to fetch balance") && (
                <span className="text-xs text-muted-foreground">Try again</span>
              )}
          </div>
        ) : (
          <div className="flex  items-center gap-1">
            <div className="flex items-center gap-1">
              <span className="text-sm font-medium">
                {parseFloat(balance) === 0
                  ? "0.00"
                  : parseFloat(balance).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 6,
                    })}
              </span>
              <Badge variant="secondary" className="text-xs px-1 py-0">
                USDC
              </Badge>
            </div>
            {parseFloat(balance) === 0 && (
              <>
                <span className="text-xs text-muted-foreground/70">
                  Get USDC to start
                </span>
              </>
            )}
          </div>
        )}
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={refresh}
        disabled={isLoading}
        className="h-6 w-6 p-0 hover:bg-muted/70 flex-shrink-0"
        aria-label="Refresh wallet balance"
        title="Refresh balance"
      >
        <RefreshCw className={cn("h-3 w-3", isLoading && "animate-spin")} />
        <span className="sr-only">Refresh balance</span>
      </Button>
    </div>
  );
};

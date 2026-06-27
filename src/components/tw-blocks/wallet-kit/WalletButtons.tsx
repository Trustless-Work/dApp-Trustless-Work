"use client";

import * as React from "react";
import { useWallet } from "./useWallet";
import { useWalletContext } from "@/providers/WalletProvider";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

type WalletButtonProps = {
  className?: string;
  mobileBar?: boolean;
};

/**
 * Wallet connection/disconnection button component
 * Shows different states based on wallet connection status
 */
export const WalletButton = ({
  className,
  mobileBar = false,
}: WalletButtonProps) => {
  const { handleConnect } = useWallet();
  const { walletAddress, walletName } = useWalletContext();

  const shortAddress = React.useMemo(() => {
    if (!walletAddress) return "";
    if (walletAddress.length <= 10) return walletAddress;
    return `${walletAddress.slice(0, 6)}…${walletAddress.slice(-4)}`;
  }, [walletAddress]);

  if (walletAddress) {
    return (
      <Button
        variant="outline"
        type="button"
        tabIndex={-1}
        className={cn(
          "h-10 min-w-0 gap-2 bg-transparent font-medium pointer-events-none",
          mobileBar ? "w-full justify-center px-2" : "px-4",
          className,
        )}
      >
        <Wallet className="size-4 shrink-0" />
        {!mobileBar ? <span className="font-medium">{walletName}</span> : null}
        <span className="truncate font-mono text-sm text-muted-foreground">
          {shortAddress}
        </span>
      </Button>
    );
  }

  return (
    <Button
      className={cn(
        "h-10 gap-2 font-medium cursor-pointer",
        mobileBar ? "w-full justify-center px-3" : "px-6",
        className,
      )}
      onClick={handleConnect}
    >
      <Wallet className="size-4 shrink-0" />
      {mobileBar ? "Connect" : "Connect Wallet"}
    </Button>
  );
};

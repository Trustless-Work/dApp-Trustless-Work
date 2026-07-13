"use client";

import * as React from "react";
import { Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useWallet } from "./useWallet";
import { useAuth } from "@/providers/AuthProvider";
import { useWalletContext } from "@/providers/WalletProvider";
import { cn } from "@/lib/utils";

type WalletButtonProps = {
  className?: string;
  mobileBar?: boolean;
};

const WalletButtonSkeleton = ({
  className,
  mobileBar = false,
}: WalletButtonProps) => (
  <div
    aria-hidden="true"
    className={cn(
      "flex h-10 min-w-0 items-center gap-2 rounded-md border border-input bg-transparent",
      mobileBar ? "w-full justify-center px-2" : "px-4",
      className,
    )}
  >
    <Skeleton className="size-4 shrink-0 rounded" />
    {!mobileBar ? <Skeleton className="h-4 w-14 shrink-0" /> : null}
    <Skeleton className="h-4 w-24 shrink-0" />
  </div>
);

export const WalletButton = ({
  className,
  mobileBar = false,
}: WalletButtonProps) => {
  const { handleConnect } = useWallet();
  const { walletAddress, walletName, hasWalletHydrated } = useWalletContext();
  const { isLoading: isSessionLoading } = useAuth();

  const shortAddress = React.useMemo(() => {
    if (!walletAddress) return "";
    if (walletAddress.length <= 10) return walletAddress;
    return `${walletAddress.slice(0, 6)}…${walletAddress.slice(-4)}`;
  }, [walletAddress]);

  if (!hasWalletHydrated || isSessionLoading) {
    return <WalletButtonSkeleton className={className} mobileBar={mobileBar} />;
  }

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

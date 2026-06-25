"use client";

import * as React from "react";
import { useWallet } from "./useWallet";
import { useWalletContext } from "@/providers/WalletProvider";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, Copy, LogOut, ChevronDown, Wallet } from "lucide-react";
import useNetwork from "@/hooks/useNetwork";
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
  const { handleConnect, handleDisconnect } = useWallet();
  const { walletAddress, walletName } = useWalletContext();
  const [copied, setCopied] = React.useState(false);
  const { currentNetwork } = useNetwork();

  const shortAddress = React.useMemo(() => {
    if (!walletAddress) return "";
    if (walletAddress.length <= 10) return walletAddress;
    return `${walletAddress.slice(0, 6)}…${walletAddress.slice(-4)}`;
  }, [walletAddress]);

  const copyAddress = async () => {
    if (!walletAddress) return;
    try {
      await navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (_) {
      console.error("Error copying address to clipboard", _);
    }
  };

  if (walletAddress) {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "h-10 min-w-0 gap-2 bg-transparent font-medium cursor-pointer",
              mobileBar
                ? "w-full justify-center px-2"
                : "px-4",
              className,
            )}
          >
            <Wallet className="size-4 shrink-0" />
            {!mobileBar ? (
              <span className="font-medium">{walletName}</span>
            ) : null}
            <span className="truncate font-mono text-sm text-muted-foreground">
              {shortAddress}
            </span>
            <ChevronDown className="size-4 shrink-0" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="end">
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wallet className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{walletName}</span>
              </div>
              <span className="text-xs px-2 py-1 rounded-md bg-muted text-muted-foreground">
                {currentNetwork}
              </span>
            </div>

            <div className="p-3 rounded-lg bg-muted/50 border">
              <p className="text-xs text-muted-foreground mb-1">Address</p>
              <p className="font-mono text-sm break-all">{walletAddress}</p>
            </div>
          </div>

          <div className="border-t p-4">
            <div className="flex gap-2">
              <Button
                onClick={copyAddress}
                variant="ghost"
                size="sm"
                className="flex-1 cursor-pointer"
                disabled={copied}
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </>
                )}
              </Button>
              <Button
                onClick={handleDisconnect}
                variant="outline"
                size="sm"
                className="flex-1 text-destructive hover:text-destructive bg-transparent cursor-pointer"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Disconnect
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
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

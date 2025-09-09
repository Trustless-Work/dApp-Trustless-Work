"use client";

import * as React from "react";
import { useWallet } from "@/modules/auth/hooks/useWallet";
import {
  Check,
  Copy,
  LogOut,
  ChevronDown,
  Wallet as WalletIcon,
} from "lucide-react";
import { Button } from "@/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/ui/popover";
import { useGlobalAuthenticationStore } from "@/store/data";
import { copyToClipboard } from "@/lib/copy";
import { useGlobalUIBoundedStore } from "@/store/ui";
import { formatAddress } from "@/lib/format";
import { ResponsiveWalletBalance } from "@/modules/auth/ResponsiveBalance";
import { Card } from "@/ui/card";
import useIsMobile from "@/hooks/useMobile";

/**
 * Wallet connection/disconnection button component
 * Shows different states based on wallet connection status
 */
export const Wallet = () => {
  const { handleConnect, handleDisconnect } = useWallet();
  const { address, name } = useGlobalAuthenticationStore((state) => state);

  const copiedKeyId = useGlobalUIBoundedStore((state) => state.copiedKeyId);
  const isMobile = useIsMobile();

  if (address) {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="h-10 px-4 gap-2 font-medium bg-transparent"
          >
            <WalletIcon className="h-4 w-4" />
            <span className="hidden sm:inline">{name}</span>
            <span className="font-mono text-sm text-muted-foreground">
              {formatAddress(address, 3)}
            </span>
            <ChevronDown className="h-4 w-4 ml-1" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-80 p-0"
          align={isMobile ? "center" : "end"}
          avoidCollisions
          collisionPadding={8}
        >
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <WalletIcon className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{name}</span>
              </div>
              <span className="text-xs px-2 py-1 rounded-md bg-muted text-muted-foreground">
                Testnet
              </span>
            </div>

            <Card className="p-3">
              <ResponsiveWalletBalance />
            </Card>

            <Card className="p-3">
              <p className="text-xs text-muted-foreground mb-1">Address</p>
              <p className="font-mono text-sm break-all">{address}</p>
            </Card>
          </div>

          <div className="border-t p-4">
            <div className="flex gap-2">
              <Button
                onClick={() => copyToClipboard(address, address)}
                variant="ghost"
                size="sm"
                className="flex-1 cursor-pointer"
                disabled={copiedKeyId === address}
              >
                {copiedKeyId === address ? (
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
      className="h-10 px-6 gap-2 font-medium cursor-pointer"
      onClick={handleConnect}
    >
      <WalletIcon className="h-4 w-4" />
      Connect Wallet
    </Button>
  );
};

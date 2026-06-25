"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import useNetwork from "@/hooks/useNetwork";
import type { NetworkType } from "@/types/network.entity";

const TOGGLE_CLASSNAME =
  "flex h-10 shrink-0 items-center gap-1.5 rounded-4xl border border-border bg-background px-3";

export const NetworkToggle = () => {
  const { currentNetwork, changeNetwork, isReseting } = useNetwork();
  const [mounted, setMounted] = useState(false);
  const [showMainnetDialog, setShowMainnetDialog] = useState(false);
  const [pendingNetwork, setPendingNetwork] = useState<NetworkType | null>(
    null,
  );

  useEffect(() => setMounted(true), []);

  const switchChecked =
    pendingNetwork === "mainnet" || currentNetwork === "mainnet";

  const handleSwitchChange = (checked: boolean) => {
    if (checked) {
      setPendingNetwork("mainnet");
      setShowMainnetDialog(true);
      return;
    }

    setPendingNetwork(null);
    changeNetwork("testnet");
  };

  const handleConfirmMainnet = () => {
    setShowMainnetDialog(false);
    setPendingNetwork(null);
    changeNetwork("mainnet");
  };

  const handleDialogOpenChange = (open: boolean) => {
    setShowMainnetDialog(open);

    if (!open) {
      setPendingNetwork(null);
    }
  };

  if (!mounted) {
    return <div className={cn(TOGGLE_CLASSNAME, "opacity-0")} aria-hidden />;
  }

  return (
    <>
      <div className={TOGGLE_CLASSNAME}>
        <span
          className={cn(
            "text-sm font-medium leading-none",
            !switchChecked ? "text-foreground" : "text-muted-foreground",
          )}
        >
          Testnet
        </span>
        <Switch
          size="sm"
          checked={switchChecked}
          onCheckedChange={handleSwitchChange}
          disabled={isReseting}
          aria-label="Toggle Stellar network"
          className="cursor-pointer"
        />
        <span
          className={cn(
            "text-sm font-medium leading-none",
            switchChecked ? "text-foreground" : "text-muted-foreground",
          )}
        >
          Mainnet
        </span>
      </div>

      <AlertDialog
        open={showMainnetDialog}
        onOpenChange={handleDialogOpenChange}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogMedia>
              <AlertTriangle className="text-amber-500" />
            </AlertDialogMedia>
            <AlertDialogTitle>Switch to Mainnet?</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to switch to the Stellar mainnet. Transactions use
              real funds and are irreversible. Make sure your wallet is
              connected to the correct network before continuing.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isReseting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmMainnet}
              disabled={isReseting}
            >
              {isReseting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Switching...
                </>
              ) : (
                "Switch to Mainnet"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

"use client";

import { useEffect, useState } from "react";
import { useMounted } from "@/hooks/useMounted";
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import useNetwork from "@/hooks/useNetwork";
import type { NetworkType } from "@/types/network.entity";

/** Flip to `true` (and unlock in client-storage) when mainnet switching returns. */
const NETWORK_SWITCHING_ENABLED = false;

const TOGGLE_CLASSNAME =
  "flex h-10 shrink-0 items-center gap-1.5 rounded-4xl border border-border bg-background px-3";

type NetworkToggleProps = {
  className?: string;
};

export const NetworkToggle = ({ className }: NetworkToggleProps) => {
  const { currentNetwork, changeNetwork, isReseting } = useNetwork();
  const mounted = useMounted();
  const [showMainnetDialog, setShowMainnetDialog] = useState(false);
  const [pendingNetwork, setPendingNetwork] = useState<NetworkType | null>(
    null,
  );

  useEffect(() => {
    if (!NETWORK_SWITCHING_ENABLED && currentNetwork !== "testnet") {
      changeNetwork("testnet");
    }
  }, [changeNetwork, currentNetwork]);

  const switchChecked = NETWORK_SWITCHING_ENABLED
    ? pendingNetwork === "mainnet" || currentNetwork === "mainnet"
    : false;

  const handleSwitchChange = (checked: boolean) => {
    if (!NETWORK_SWITCHING_ENABLED) {
      return;
    }

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
    return (
      <div
        className={cn(TOGGLE_CLASSNAME, "opacity-0", className)}
        aria-hidden
      />
    );
  }

  const toggle = (
    <div
      className={cn(
        TOGGLE_CLASSNAME,
        !NETWORK_SWITCHING_ENABLED && "cursor-not-allowed opacity-70",
        className,
      )}
    >
      <span
        className={cn(
          "text-xs font-medium leading-none sm:text-sm",
          !switchChecked ? "text-foreground" : "text-muted-foreground",
        )}
      >
        <span className="sm:hidden">Test</span>
        <span className="hidden sm:inline">Testnet</span>
      </span>
      <Switch
        size="sm"
        checked={switchChecked}
        onCheckedChange={handleSwitchChange}
        disabled={!NETWORK_SWITCHING_ENABLED || isReseting}
        aria-label="Toggle Stellar network"
        className={NETWORK_SWITCHING_ENABLED ? "cursor-pointer" : undefined}
      />
      <span
        className={cn(
          "text-xs font-medium leading-none sm:text-sm",
          switchChecked ? "text-foreground" : "text-muted-foreground",
        )}
      >
        <span className="sm:hidden">Main</span>
        <span className="hidden sm:inline">Mainnet</span>
      </span>
    </div>
  );

  return (
    <>
      {NETWORK_SWITCHING_ENABLED ? (
        toggle
      ) : (
        <Tooltip>
          <TooltipTrigger asChild>{toggle}</TooltipTrigger>
          <TooltipContent>Not available yet. Coming soon.</TooltipContent>
        </Tooltip>
      )}

      {NETWORK_SWITCHING_ENABLED ? (
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
      ) : null}
    </>
  );
};

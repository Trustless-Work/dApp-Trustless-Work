"use client";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import useNetwork from "@/hooks/useNetwork";
import { cn } from "@/lib/utils";
import { Loader2, AlertTriangle, AlertCircle, Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const NetworkToggle = () => {
  const { currentNetwork, changeNetwork, isLoading } = useNetwork();
  const [showMainnetDialog, setShowMainnetDialog] = useState(false);
  const [pendingNetwork, setPendingNetwork] = useState<
    "testnet" | "mainnet" | null
  >(null);

  const handleNetworkChange = (checked: boolean) => {
    const newNetwork = checked ? "mainnet" : "testnet";

    if (newNetwork === "mainnet") {
      setPendingNetwork("mainnet");
      setShowMainnetDialog(true);
    } else {
      changeNetwork(newNetwork);
    }
  };

  const handleConfirmMainnet = () => {
    setShowMainnetDialog(false);
    if (pendingNetwork === "mainnet") {
      changeNetwork("mainnet");
    }
    setPendingNetwork(null);
  };

  const handleCancelMainnet = () => {
    setShowMainnetDialog(false);
    setPendingNetwork(null);
  };

  const switchChecked =
    pendingNetwork === "mainnet" || currentNetwork === "mainnet";

  return (
    <>
      <div className="flex items-center space-x-2">
        <Switch
          id="network-mode"
          checked={switchChecked}
          onCheckedChange={handleNetworkChange}
          disabled={isLoading}
          className="data-[state=checked]:bg-blue-600 disabled:opacity-50"
        />
        <Label
          htmlFor="network-mode"
          className={cn(
            "text-sm font-medium cursor-pointer",
            currentNetwork === "mainnet"
              ? "text-primary-600 dark:text-primary-500"
              : "text-gray-600 dark:text-gray-400",
            isLoading && "opacity-50",
          )}
        >
          {currentNetwork === "mainnet" ? "Mainnet" : "Testnet"}
        </Label>
      </div>

      <Dialog open={showMainnetDialog} onOpenChange={setShowMainnetDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500 dark:text-orange-400" />
              Switch to Mainnet
            </DialogTitle>
            <DialogDescription className="text-left">
              You are about to switch to the Stellar Mainnet network. Please
              read the following information carefully:
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 text-sm">
            <div className="bg-orange-50 dark:bg-orange-950/50 border border-orange-200 dark:border-orange-800 rounded-lg p-3">
              <h4 className="font-semibold text-orange-800 dark:text-orange-200 mb-2 flex items-center">
                <AlertCircle className="w-4 h-4 mr-2" /> Important Warning
              </h4>
              <ul className="text-orange-700 dark:text-orange-300 space-y-1">
                <li>• Mainnet uses real XLM and real assets</li>
                <li>• All transactions are permanent and irreversible</li>
                <li>• You will be using real funds, not test tokens</li>
                <li>• Make sure you understand the risks involved</li>
                <li>• You will be using real funds, not test tokens</li>
                <li>
                  • Make sure that your wallet is connected to the correct
                  network (Mainnet) or (Testnet)
                </li>
                <li>
                  • If you are having problems when switching to mainnet, please
                  re-connect your wallet
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
              <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2 flex items-center">
                <Info className="w-4 h-4 mr-2" /> What is Mainnet?
              </h4>
              <p className="text-blue-700 dark:text-blue-300">
                Mainnet is the live Stellar network where real transactions
                occur. Unlike testnet, all operations here involve actual
                cryptocurrency and have real financial implications.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCancelMainnet}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button onClick={handleConfirmMainnet} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Switching...
                </>
              ) : (
                "Switch to Mainnet"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NetworkToggle;

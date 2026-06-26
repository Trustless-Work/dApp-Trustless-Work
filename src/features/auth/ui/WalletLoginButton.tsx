"use client";

import { Loader2, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { WalletAuthPhase } from "@/features/auth/hooks/useWalletAuth";

type WalletLoginButtonProps = {
  phase: WalletAuthPhase;
  isLoading: boolean;
  onLogin: () => void;
};

function getPhaseLabel(phase: WalletAuthPhase): string {
  switch (phase) {
    case "connecting":
    case "signing":
      return "Connecting wallet...";
    case "authenticating":
      return "Signing you in...";
    case "registering":
      return "Creating your account...";
    default:
      return "Continue with Wallet";
  }
}

export const WalletLoginButton = ({
  phase,
  isLoading,
  onLogin,
}: WalletLoginButtonProps) => {
  return (
    <Button
      type="button"
      className="w-full"
      size="lg"
      disabled={isLoading}
      onClick={onLogin}
    >
      {isLoading ? (
        <Loader2 data-icon="inline-start" className="animate-spin" />
      ) : (
        <Wallet data-icon="inline-start" />
      )}
      {getPhaseLabel(phase)}
    </Button>
  );
};

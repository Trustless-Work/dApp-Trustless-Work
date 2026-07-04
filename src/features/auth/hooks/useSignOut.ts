"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@/components/tw-blocks/wallet-kit/useWallet";
import { clearClientAuthState } from "@/features/auth/lib/logout-client";
import { useLogout } from "@/features/auth/hooks/useLogout";

type UseSignOutOptions = {
  redirectTo?: string;
};

export function useSignOut({ redirectTo = "/login" }: UseSignOutOptions = {}) {
  const router = useRouter();
  const logoutMutation = useLogout();
  const { handleDisconnect } = useWallet();

  const signOut = useCallback(async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch {
      // Session may already be cleared locally.
    }

    await handleDisconnect();
    await clearClientAuthState({
      reason: "logout",
      redirect: false,
    });
    router.push(redirectTo);
  }, [handleDisconnect, logoutMutation, redirectTo, router]);

  return {
    signOut,
    isSigningOut: logoutMutation.isPending,
  };
}

"use client";

import {
  disconnectWalletKitSafe,
  resetWalletKitLoader,
} from "@/components/tw-blocks/wallet-kit/wallet-kit";
import { getRegisteredQueryClient } from "@/lib/query-client-holder";

export const AUTH_EXPIRED_EVENT = "tw:auth-expired";

export type AuthExpiredReason = "session_expired" | "unauthorized" | "logout";

type ClearClientAuthStateOptions = {
  reason?: AuthExpiredReason;
  redirect?: boolean;
  redirectTo?: string;
};

function buildLoginRedirect(reason: AuthExpiredReason): string {
  const params = new URLSearchParams();
  if (reason === "session_expired") {
    params.set("reason", "session_expired");
  }
  const query = params.toString();
  return query ? `/login?${query}` : "/login";
}

function clearWalletStorage(): void {
  localStorage.removeItem("walletAddress");
  localStorage.removeItem("walletName");
}

export async function clearClientAuthState(
  options: ClearClientAuthStateOptions = {},
): Promise<void> {
  const {
    reason = "unauthorized",
    redirect = true,
    redirectTo = buildLoginRedirect(reason),
  } = options;

  const queryClient = getRegisteredQueryClient();
  queryClient?.setQueryData(["session", "me"], null);
  queryClient?.removeQueries({ queryKey: ["session"] });

  clearWalletStorage();
  resetWalletKitLoader();
  await disconnectWalletKitSafe();

  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent(AUTH_EXPIRED_EVENT, { detail: { reason } }),
    );
  }

  if (redirect && typeof window !== "undefined") {
    const currentPath = window.location.pathname;
    if (!currentPath.startsWith("/login")) {
      window.location.assign(redirectTo);
    }
  }
}

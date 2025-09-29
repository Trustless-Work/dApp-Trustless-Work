"use client";

import { useEffect, useRef } from "react";
import { kit } from "@/lib/stellar-wallet-kit";
import { useGlobalAuthenticationStore } from "@/store/data";
import { toast } from "sonner";

// Polling interval (ms). Moderate frequency to avoid saturation.
const POLL_INTERVAL = 4000;

/**
 * Hook that detects a change in the active account in the underlying wallet.
 * If the actual wallet address (kit.getAddress()) differs from the one
 * stored in the global state (authenticated), a disconnect is forced
 * to require the user to explicitly reconnect.
 */
export const useWalletChangeWatcher = () => {
  const storedAddress = useGlobalAuthenticationStore((s) => s.address);
  const disconnectWalletStore = useGlobalAuthenticationStore(
    (s) => s.disconnectWalletStore,
  );

  const lastCheckedRef = useRef<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!storedAddress) {
      lastCheckedRef.current = null;
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    const check = async () => {
      try {
        const result = await kit.getAddress().catch(() => null);
        const current = result?.address || null;

        if (!current) return;

        if (!lastCheckedRef.current) {
          lastCheckedRef.current = current;
          return;
        }

        if (current !== storedAddress) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }

          try {
            await kit.disconnect();
          } catch (_) {
            /* silent */
          }

          disconnectWalletStore();
          toast.warning(
            "Wallet address changed. Please reconnect with your new wallet.",
          );
        }
      } catch (err) {
        // Silent: avoid noise in the console due to polling.
      }
    };
    
    check();
    timerRef.current = setInterval(check, POLL_INTERVAL);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [storedAddress, disconnectWalletStore]);
};

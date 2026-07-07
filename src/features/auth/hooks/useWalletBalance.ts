"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { HORIZON_URLS } from "../../../lib/stellar-networks";
import { playSound } from "@/lib/sounds";
import { useWalletContext } from "@/providers/WalletProvider";
import { useWallet } from "@/components/tw-blocks/wallet-kit/useWallet";
import { isValidStellarNetwork } from "@/helpers/validators.helper";

// Module-level request coordination to prevent duplicate requests across hook instances
let globalRequestInFlight = false;

interface WalletBalance {
  balance: string;
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
}

export const useWalletBalance = (): WalletBalance => {
  const [balance, setBalance] = useState<string>("0");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isConnected } = useWallet();
  const { walletAddress } = useWalletContext();

  // Refs for tracking timers and in-flight requests
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isRequestInFlightRef = useRef(false);
  const fetchBalanceRef = useRef<() => Promise<void>>(async () => {});

  // Helper function to clear retry timeout
  const clearRetryTimeout = useCallback(() => {
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
  }, []);

  const fetchBalance = useCallback(async () => {
    // Prevent duplicate in-flight requests across all hook instances
    if (globalRequestInFlight) {
      return;
    }

    if (!walletAddress || !isConnected) {
      setBalance("0");
      setError(null);
      setIsLoading(false);
      // Don't reset isRequestInFlightRef here - let finally block handle it
      return;
    }

    if (typeof window === "undefined") {
      console.error("Not in browser environment - useWalletBalance hook");
      setError("Browser environment required");
      setBalance("0");
      setIsLoading(false);
      // Don't reset isRequestInFlightRef here - let finally block handle it
      return;
    }

    if (
      !walletAddress ||
      walletAddress.length < 50 ||
      !walletAddress.startsWith("G")
    ) {
      console.error("Invalid Stellar address format - useWalletBalance hook");
      setError("Invalid address format");
      setBalance("0");
      setIsLoading(false);
      // Don't reset isRequestInFlightRef here - let finally block handle it
      return;
    }

    // Clear any existing retry timeout
    clearRetryTimeout();

    setIsLoading(true);
    setError(null);
    globalRequestInFlight = true;
    isRequestInFlightRef.current = true;

    let currentNetwork: "testnet" | "mainnet" = "testnet"; // Default value

    try {
      const storedNetwork = localStorage.getItem("network");
      currentNetwork =
        storedNetwork && isValidStellarNetwork(storedNetwork)
          ? storedNetwork
          : "testnet";

      const horizonUrl = HORIZON_URLS[currentNetwork];
      if (!horizonUrl) {
        throw new Error("Invalid network - useWalletBalance hook");
      }

      let account: {
        balances: Array<{
          asset_type: string;
          asset_code?: string;
          asset_issuer?: string;
          balance: string;
        }>;
      };
      try {
        const response = await fetch(`${horizonUrl}/accounts/${walletAddress}`);

        if (!response.ok) {
          if (response.status === 404) {
            setBalance("0");
            setError(null); // Clear error for new wallets
            setIsLoading(false);
            globalRequestInFlight = false;
            isRequestInFlightRef.current = false; // Need to reset here since we're in inner try-catch
            return;
          }
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        account = await response.json();
      } catch (accountError) {
        console.error("Failed to load account:", accountError);
        if (
          accountError instanceof Error &&
          accountError.message.includes("fetch")
        ) {
          throw new Error("Network error - useWalletBalance hook");
        }
        throw new Error("Failed to load account - useWalletBalance hook");
      }

      // Validate account structure
      if (!account || !account.balances || !Array.isArray(account.balances)) {
        console.error("Invalid account structure:", account);
        throw new Error("Invalid account structure - useWalletBalance hook");
      }

      // Find ANY USDC asset balance (regardless of issuer)
      const usdcBalance = account.balances.find(
        (balance) =>
          balance.asset_type === "credit_alphanum4" &&
          balance.asset_code === "USDC",
      );

      if (usdcBalance && typeof usdcBalance.balance === "string") {
        // Validate balance value
        const balanceValue = parseFloat(usdcBalance.balance);
        if (isNaN(balanceValue) || balanceValue < 0) {
          console.error("Invalid balance value:", usdcBalance.balance);
          throw new Error("Invalid balance value - useWalletBalance hook");
        }

        setBalance(usdcBalance.balance);
      } else {
        setBalance("0");
      }
    } catch (err) {
      console.error("Error fetching wallet balance:", err);
      playSound("error");

      // Handle different types of errors
      if (err instanceof Error) {
        if (
          err.message.includes("network") ||
          err.message.includes("Network error") ||
          err.message.includes("HTTP 5") ||
          err.message.includes("fetch")
        ) {
          setError("Network error");
          // Clear any existing retry timeout before scheduling a new one
          clearRetryTimeout();
          // Auto-retry network errors after 5 seconds
          retryTimeoutRef.current = setTimeout(() => {
            if (walletAddress && isConnected) {
              void fetchBalanceRef.current();
            }
          }, 5000);
        } else if (err.message.includes("Invalid")) {
          setError(err.message);
        } else if (err.message.includes("HTTP 4")) {
          setError("Failed to fetch balance");
        } else {
          setError("Failed to fetch balance");
        }
      } else {
        setError("Failed to fetch balance");
      }

      setBalance("0");
    } finally {
      setIsLoading(false);
      globalRequestInFlight = false;
      isRequestInFlightRef.current = false;
    }
  }, [walletAddress, isConnected, clearRetryTimeout]);

  useEffect(() => {
    fetchBalanceRef.current = fetchBalance;
  }, [fetchBalance]);

  const refresh = useCallback(() => {
    void fetchBalance();
  }, [fetchBalance]);

  useEffect(() => {
    void fetchBalance();

    // Set up periodic refresh every 30 seconds when connected
    if (walletAddress && isConnected) {
      intervalRef.current = setInterval(fetchBalance, 30000);
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      };
    }
  }, [walletAddress, isConnected, fetchBalance]);

  // Listen for network changes
  useEffect(() => {
    const handleNetworkChange = () => {
      fetchBalance();
    };

    window.addEventListener("storage", handleNetworkChange);
    return () => {
      // Clear any pending retry timer before removing the storage listener
      clearRetryTimeout();
      window.removeEventListener("storage", handleNetworkChange);
    };
  }, [fetchBalance, clearRetryTimeout]);

  // Clear retry timeout when dependencies change
  useEffect(() => {
    clearRetryTimeout();
  }, [walletAddress, isConnected, clearRetryTimeout]);

  // Cleanup function to clear all timers
  useEffect(() => {
    return () => {
      clearRetryTimeout();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [clearRetryTimeout]);

  return {
    balance,
    isLoading,
    error,
    refresh,
  };
};

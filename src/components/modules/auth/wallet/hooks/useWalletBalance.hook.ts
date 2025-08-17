"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useWallet } from "./wallet.hook";
import { useGlobalAuthenticationStore } from "@/core/store/data";
import {
  HORIZON_URLS,
  USDC_ISSUERS,
  isValidStellarNetwork,
  type StellarNetwork,
} from "../constants";

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

  // Clear error state on mount
  useEffect(() => {
    setError(null);
  }, []);

  // Refs for tracking timers and in-flight requests
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isRequestInFlightRef = useRef(false);

  // Debug: Log hook instance creation
  const hookId = useRef(Math.random().toString(36).substr(2, 9));
  console.log(`[${hookId.current}] useWalletBalance hook instance created`);

  // Helper function to clear retry timeout
  const clearRetryTimeout = useCallback(() => {
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
  }, []);

  const { address } = useGlobalAuthenticationStore();
  const { isConnected } = useWallet();

  const fetchBalance = useCallback(async () => {
    // Prevent duplicate in-flight requests across all hook instances
    if (globalRequestInFlight) {
      console.log(
        `[${hookId.current}] Global request already in flight, skipping...`,
      );
      return;
    }

    if (!address || !isConnected) {
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

    console.log(
      `[${hookId.current}] Starting balance fetch for address:`,
      address,
    );

    if (!address || address.length < 50 || !address.startsWith("G")) {
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

    let currentNetwork: StellarNetwork = "testnet"; // Default value

    try {
      const storedNetwork = localStorage.getItem("network");
      currentNetwork =
        storedNetwork && isValidStellarNetwork(storedNetwork)
          ? storedNetwork
          : "testnet";
      console.log("Using network:", currentNetwork);

      const horizonUrl = HORIZON_URLS[currentNetwork];
      if (!horizonUrl) {
        throw new Error("Invalid network - useWalletBalance hook");
      }

      console.log("Calling Horizon API:", `${horizonUrl}/accounts/${address}`);

      let account: {
        balances: Array<{
          asset_type: string;
          asset_code?: string;
          asset_issuer?: string;
          balance: string;
        }>;
      };
      try {
        const response = await fetch(`${horizonUrl}/accounts/${address}`);

        if (!response.ok) {
          if (response.status === 404) {
            setBalance("0");
            setError(null); // Clear error for new wallets
            console.log(
              "Account not found (new wallet) - setting balance to 0",
            );
            setIsLoading(false);
            globalRequestInFlight = false;
            isRequestInFlightRef.current = false; // Need to reset here since we're in inner try-catch
            return;
          }
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        account = await response.json();
        console.log("Account data received:", account);
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

      // Get USDC issuer for current network
      const currentIssuer = USDC_ISSUERS[currentNetwork];
      if (!currentIssuer) {
        throw new Error(
          "USDC issuer not found for network - useWalletBalance hook",
        );
      }

      // Validate account structure
      if (!account || !account.balances || !Array.isArray(account.balances)) {
        console.error("Invalid account structure:", account);
        throw new Error("Invalid account structure - useWalletBalance hook");
      }

      // Find USDC asset balance
      const usdcBalance = account.balances.find(
        (balance) =>
          balance.asset_type === "credit_alphanum4" &&
          balance.asset_code === "USDC" &&
          balance.asset_issuer === currentIssuer,
      );

      console.log("USDC balance found:", usdcBalance);

      if (usdcBalance && typeof usdcBalance.balance === "string") {
        // Validate balance value
        const balanceValue = parseFloat(usdcBalance.balance);
        if (isNaN(balanceValue) || balanceValue < 0) {
          console.error("Invalid balance value:", usdcBalance.balance);
          throw new Error("Invalid balance value - useWalletBalance hook");
        }

        setBalance(usdcBalance.balance);
        console.log(
          `Real balance fetched: ${usdcBalance.balance} USDC on ${currentNetwork}`,
        );
      } else {
        setBalance("0");
        console.log(`No USDC found for ${address} on ${currentNetwork}`);
        console.log("Available balances:", account.balances);
      }
    } catch (err) {
      console.error("Error fetching wallet balance:", err);

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
            if (address && isConnected) {
              fetchBalance();
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

      // Log the error for debugging
      console.error("Wallet balance error details:", {
        error: err,
        address,
        network: currentNetwork,
        timestamp: new Date().toISOString(),
      });

      setBalance("0");
    } finally {
      setIsLoading(false);
      globalRequestInFlight = false;
      isRequestInFlightRef.current = false;
    }
  }, [address, isConnected]);

  const refresh = useCallback(() => {
    fetchBalance();
  }, [fetchBalance]);

  useEffect(() => {
    // Clear any previous error state when dependencies change
    setError(null);

    fetchBalance();

    // Set up periodic refresh every 30 seconds when connected
    if (address && isConnected) {
      intervalRef.current = setInterval(fetchBalance, 30000);
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      };
    }
  }, [address, isConnected, fetchBalance]);

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
  }, [address, isConnected, clearRetryTimeout]);

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

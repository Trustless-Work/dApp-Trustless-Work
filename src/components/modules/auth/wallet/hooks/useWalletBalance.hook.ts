"use client";

import { useCallback, useEffect, useState } from "react";
import { useWallet } from "./wallet.hook";
import { useGlobalAuthenticationStore } from "@/core/store/data";

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

  const { address } = useGlobalAuthenticationStore();
  const { isConnected } = useWallet();

  const fetchBalance = useCallback(async () => {
    if (!address || !isConnected) {
      setBalance("0");
      setError(null);
      return;
    }

    if (typeof window === "undefined") {
      console.error("Not in browser environment - useWalletBalance hook");
      setError("Browser environment required");
      setBalance("0");
      setIsLoading(false);
      return;
    }

    console.log("Starting balance fetch for address:", address);

    if (!address || address.length < 50 || !address.startsWith("G")) {
      console.error("Invalid Stellar address format - useWalletBalance hook");
      setError("Invalid address format");
      setBalance("0");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    let currentNetwork: string = "testnet"; // Default value

    try {
      currentNetwork = localStorage.getItem("network") || "testnet";
      console.log("Using network:", currentNetwork);

      if (!["testnet", "mainnet"].includes(currentNetwork)) {
        throw new Error("Invalid network - useWalletBalance hook");
      }

      const horizonUrls = {
        testnet: "https://horizon-testnet.stellar.org",
        mainnet: "https://horizon.stellar.org",
      };

      const horizonUrl =
        horizonUrls[currentNetwork as keyof typeof horizonUrls];
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
            setError(null);
            console.log(
              "Account not found (new wallet) - setting balance to 0",
            );
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

      const usdcIssuers = {
        testnet: "GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVBL4LADV2C3B6O4JUEVL", // Testnet USDC
        mainnet: "GA5ZSEJYB37JRC5AVCIA5MOP4RHTM35XDP5G2O4D3J6I6K6WOH2L3VSE", // Mainnet USDC
      };

      const currentIssuer =
        usdcIssuers[currentNetwork as keyof typeof usdcIssuers];
      if (!currentIssuer) {
        throw new Error(
          "USDC issuer not found for network - useWalletBalance hook",
        );
      }

      if (!account || !account.balances || !Array.isArray(account.balances)) {
        console.error("Invalid account structure:", account);
        throw new Error("Invalid account structure - useWalletBalance hook");
      }

      const usdcBalance = account.balances.find(
        (balance) =>
          balance.asset_type === "credit_alphanum4" &&
          balance.asset_code === "USDC" &&
          balance.asset_issuer === currentIssuer,
      );

      console.log("USDC balance found:", usdcBalance);

      if (usdcBalance && typeof usdcBalance.balance === "string") {
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

      if (err instanceof Error) {
        if (
          err.message.includes("network") ||
          err.message.includes("Network error") ||
          err.message.includes("HTTP 5") ||
          err.message.includes("fetch")
        ) {
          setError("Network error - useWalletBalance hook");
          setTimeout(() => {
            if (address && isConnected) {
              fetchBalance();
            }
          }, 5000);
        } else if (err.message.includes("Invalid")) {
          setError(err.message);
        } else if (err.message.includes("HTTP 4")) {
          setError("API error - useWalletBalance hook");
        } else {
          setError("Failed to fetch balance - useWalletBalance hook");
        }
      } else {
        setError("Failed to fetch balance - useWalletBalance hook");
      }

      console.error("Wallet balance error details:", {
        error: err,
        address,
        network: currentNetwork,
        timestamp: new Date().toISOString(),
      });

      setBalance("0");
    } finally {
      setIsLoading(false);
    }
  }, [address, isConnected]);

  const refresh = useCallback(() => {
    fetchBalance();
  }, [fetchBalance]);

  useEffect(() => {
    fetchBalance();

    if (address && isConnected) {
      const interval = setInterval(fetchBalance, 30000);
      return () => clearInterval(interval);
    }
  }, [address, isConnected, fetchBalance]);

  useEffect(() => {
    const handleNetworkChange = () => {
      fetchBalance();
    };

    window.addEventListener("storage", handleNetworkChange);
    return () => window.removeEventListener("storage", handleNetworkChange);
  }, [fetchBalance]);

  return {
    balance,
    isLoading,
    error,
    refresh,
  };
};

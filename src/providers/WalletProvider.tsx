"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { AUTH_EXPIRED_EVENT } from "@/features/auth/lib/logout-client";

type WalletContextType = {
  walletAddress: string | null;
  walletName: string | null;
  hasWalletHydrated: boolean;
  setWalletInfo: (address: string, name: string) => void;
  clearWalletInfo: () => void;
};

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [walletName, setWalletName] = useState<string | null>(null);
  const [hasWalletHydrated, setHasWalletHydrated] = useState(false);

  useEffect(() => {
    const storedAddress = localStorage.getItem("walletAddress");
    const storedName = localStorage.getItem("walletName");

    if (storedAddress) setWalletAddress(storedAddress);
    if (storedName) setWalletName(storedName);
    setHasWalletHydrated(true);
  }, []);

  useEffect(() => {
    const handleAuthExpired = () => {
      setWalletAddress(null);
      setWalletName(null);
    };

    window.addEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired);
    return () => {
      window.removeEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired);
    };
  }, []);

  const setWalletInfo = (address: string, name: string) => {
    setWalletAddress(address);
    setWalletName(name);
    localStorage.setItem("walletAddress", address);
    localStorage.setItem("walletName", name);
  };

  const clearWalletInfo = () => {
    setWalletAddress(null);
    setWalletName(null);
    localStorage.removeItem("walletAddress");
    localStorage.removeItem("walletName");
  };

  return (
    <WalletContext.Provider
      value={{
        walletAddress,
        walletName,
        hasWalletHydrated,
        setWalletInfo,
        clearWalletInfo,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWalletContext = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWalletContext must be used within WalletProvider");
  }
  return context;
};

"use client";

import { LanguageProvider } from "./LanguageProvider";
import MoonpayClientProvider from "./MoonpayClientProvider";
import ReactQueryClientProvider from "./ReactQueryClientProvider";
import { TrustlessWorkProvider } from "./TrustlessWorkProvider";
import { useEffect, useState } from "react";
import { useWalletChangeWatcher } from "@/modules/auth/hooks/useWalletChangeWatcher";

export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  const [networkKey, setNetworkKey] = useState("testnet");

  useEffect(() => {
    const currentNetwork =
      (localStorage.getItem("network") as "testnet" | "mainnet") || "testnet";
    setNetworkKey(currentNetwork);
  }, []);

  // Vigila cambios en la cuenta de la wallet y fuerza desconexión si cambia.
  useWalletChangeWatcher();

  return (
    <ReactQueryClientProvider>
      <LanguageProvider>
        <TrustlessWorkProvider key={networkKey}>
          <MoonpayClientProvider>{children}</MoonpayClientProvider>
        </TrustlessWorkProvider>
      </LanguageProvider>
    </ReactQueryClientProvider>
  );
};

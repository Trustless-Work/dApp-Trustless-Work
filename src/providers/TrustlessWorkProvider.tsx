"use client";

import React from "react";
import {
  development,
  mainNet,
  TrustlessWorkConfig,
} from "@trustless-work/escrow";
import { getStoredNetwork } from "@/lib/client-storage";

interface TrustlessWorkProviderProps {
  children: React.ReactNode;
}

export function TrustlessWorkProvider({
  children,
}: TrustlessWorkProviderProps) {
  const currentNetwork = getStoredNetwork();

  const apiKeyTestnet =
    process.env.NEXT_PUBLIC_ESCROW_MANAGER_API_KEY_TESTNET || "";
  const apiKeyMainnet =
    process.env.NEXT_PUBLIC_ESCROW_MANAGER_API_KEY_MAINNET || "";
  const baseURL = currentNetwork === "mainnet" ? mainNet : development;

  return (
    <TrustlessWorkConfig
      baseURL={baseURL}
      apiKey={currentNetwork === "mainnet" ? apiKeyMainnet : apiKeyTestnet}
    >
      {children}
    </TrustlessWorkConfig>
  );
}

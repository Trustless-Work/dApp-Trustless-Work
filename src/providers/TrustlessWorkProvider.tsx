"use client";

import React from "react";
import {
  development,
  mainNet,
  TrustlessWorkConfig,
} from "@trustless-work/escrow";

interface TrustlessWorkProviderProps {
  children: React.ReactNode;
}

export function TrustlessWorkProvider({
  children,
}: TrustlessWorkProviderProps) {
  /**
   * Get the API key from the environment variables
   */
  const apiKey = process.env.NEXT_PUBLIC_API_KEY || "";

  // Leer directamente de localStorage para evitar problemas de sincronización
  const currentNetwork =
    typeof window !== "undefined"
      ? (localStorage.getItem("network") as "testnet" | "mainnet") || "testnet"
      : "testnet";

  const baseURL = currentNetwork === "mainnet" ? mainNet : development;

  return (
    <TrustlessWorkConfig baseURL={baseURL} apiKey={apiKey}>
      {children}
    </TrustlessWorkConfig>
  );
}

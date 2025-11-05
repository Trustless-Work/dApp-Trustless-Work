"use client"; // make sure this is a client component

import React from "react";
import {
  // development environment = "https://dev.api.trustlesswork.com"
  development,

  // mainnet environment = "https://api.trustlesswork.com"
  // mainNet,
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

  return (
    <TrustlessWorkConfig baseURL={development} apiKey={apiKey}>
      {children}
    </TrustlessWorkConfig>
  );
}

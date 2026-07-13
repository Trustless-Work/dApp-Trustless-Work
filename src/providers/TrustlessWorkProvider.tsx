"use client";

import { clientEnv } from "@/lib/env";
import {
  TrustlessWorkConfig,
  development,
} from "@trustless-work/escrow";
import type { ComponentProps, ReactNode } from "react";

type TrustlessWorkProviderProps = {
  children: ReactNode;
};

type TrustlessWorkChildren = ComponentProps<
  typeof TrustlessWorkConfig
>["children"];

export const TrustlessWorkProvider = ({
  children,
}: TrustlessWorkProviderProps) => {
  const apiKey = clientEnv.integrations.twApiKey;

  return (
    <TrustlessWorkConfig baseURL={development} apiKey={apiKey}>
      {children as TrustlessWorkChildren}
    </TrustlessWorkConfig>
  );
};

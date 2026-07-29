"use client";

import { TrustlessWorkConfig } from "@trustless-work/escrow";
import type { ComponentProps, ReactNode } from "react";
import { useMemo } from "react";
import { useActiveOrganization } from "@/providers/OrganizationProvider";

type TrustlessWorkProviderProps = {
  children: ReactNode;
};

type TrustlessWorkChildren = ComponentProps<
  typeof TrustlessWorkConfig
>["children"];

const CORE_BFF_BASE_URL = "/api/core";

export const TrustlessWorkProvider = ({
  children,
}: TrustlessWorkProviderProps) => {
  const { activeOrganizationId } = useActiveOrganization();

  const defaultHeaders = useMemo(() => {
    if (!activeOrganizationId) {
      return undefined;
    }

    return { "X-TW-Platform": activeOrganizationId };
  }, [activeOrganizationId]);

  return (
    <TrustlessWorkConfig
      baseURL={CORE_BFF_BASE_URL}
      defaultHeaders={defaultHeaders}
    >
      {children as TrustlessWorkChildren}
    </TrustlessWorkConfig>
  );
};

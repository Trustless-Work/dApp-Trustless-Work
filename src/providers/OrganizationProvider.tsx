"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useOrganizations } from "@/features/organizations/hooks/useOrganizations";
import type { OrganizationResponse } from "@/features/organizations/types/organization.types";
import {
  getStoredActiveOrganizationId,
  setStoredActiveOrganizationId,
} from "@/lib/client-storage";

type OrganizationContextValue = {
  organizations: OrganizationResponse[];
  activeOrganization: OrganizationResponse | null;
  activeOrganizationId: string | null;
  setActiveOrganization: (organizationId: string) => void;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
};

const OrganizationContext = createContext<OrganizationContextValue | null>(
  null,
);

type OrganizationProviderProps = {
  children: React.ReactNode;
};

function resolveActiveOrganizationId(
  organizations: OrganizationResponse[],
  storedId: string | null,
): string | null {
  if (organizations.length === 0) {
    return null;
  }

  if (storedId && organizations.some((org) => org.id === storedId)) {
    return storedId;
  }

  return organizations[0]?.id ?? null;
}

export const OrganizationProvider = ({
  children,
}: OrganizationProviderProps) => {
  const { data, isLoading, isError, refetch } = useOrganizations();
  const organizations = data ?? [];
  const [activeOrganizationId, setActiveOrganizationIdState] = useState<
    string | null
  >(null);
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setHasHydrated(true);
    setActiveOrganizationIdState(getStoredActiveOrganizationId());
  }, []);

  useEffect(() => {
    if (!hasHydrated || isLoading) {
      return;
    }

    const resolvedId = resolveActiveOrganizationId(
      organizations,
      activeOrganizationId,
    );

    if (resolvedId !== activeOrganizationId) {
      setActiveOrganizationIdState(resolvedId);
      if (resolvedId) {
        setStoredActiveOrganizationId(resolvedId);
      }
    }
  }, [activeOrganizationId, hasHydrated, isLoading, organizations]);

  const setActiveOrganization = useCallback((organizationId: string) => {
    setActiveOrganizationIdState(organizationId);
    setStoredActiveOrganizationId(organizationId);
  }, []);

  const activeOrganization = useMemo(
    () => organizations.find((org) => org.id === activeOrganizationId) ?? null,
    [activeOrganizationId, organizations],
  );

  const value: OrganizationContextValue = {
    organizations,
    activeOrganization,
    activeOrganizationId,
    setActiveOrganization,
    isLoading: isLoading || !hasHydrated,
    isError,
    refetch: () => {
      void refetch();
    },
  };

  return (
    <OrganizationContext.Provider value={value}>
      {children}
    </OrganizationContext.Provider>
  );
};

export function useActiveOrganization() {
  const context = useContext(OrganizationContext);
  if (!context) {
    throw new Error(
      "useActiveOrganization must be used within OrganizationProvider",
    );
  }
  return context;
}

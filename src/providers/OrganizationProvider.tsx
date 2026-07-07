"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import { useOrganizations } from "@/features/organizations/hooks/useOrganizations";
import type { OrganizationResponse } from "@/features/organizations/types/organization.types";
import { useMounted } from "@/hooks/useMounted";
import { extractListItems } from "@/lib/pagination";
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

function subscribeToStorage() {
  return () => {};
}

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
  const organizations = useMemo(
    () => extractListItems<OrganizationResponse>(data),
    [data],
  );
  const hasHydrated = useMounted();
  const storedOrganizationId = useSyncExternalStore(
    subscribeToStorage,
    getStoredActiveOrganizationId,
    () => null,
  );
  const [selectedOrganizationId, setSelectedOrganizationId] = useState<
    string | null
  >(null);

  const activeOrganizationId = useMemo(() => {
    if (!hasHydrated) {
      return null;
    }

    const preferredId = selectedOrganizationId ?? storedOrganizationId;
    return resolveActiveOrganizationId(organizations, preferredId);
  }, [
    hasHydrated,
    selectedOrganizationId,
    storedOrganizationId,
    organizations,
  ]);

  useEffect(() => {
    if (activeOrganizationId) {
      setStoredActiveOrganizationId(activeOrganizationId);
    }
  }, [activeOrganizationId]);

  const setActiveOrganization = useCallback((organizationId: string) => {
    setSelectedOrganizationId(organizationId);
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

import type { NetworkType } from "@/types/network.entity";

const noopStorage: Storage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
  clear: () => {},
  key: () => null,
  length: 0,
};

export function getClientStorage(): Storage {
  if (typeof window === "undefined") {
    return noopStorage;
  }

  return window.localStorage;
}

export function getStoredNetwork(): NetworkType {
  const stored = getClientStorage().getItem("network");
  return stored === "mainnet" ? "mainnet" : "testnet";
}

export const ACTIVE_ORGANIZATION_STORAGE_KEY = "activeOrganizationId";

export function getStoredActiveOrganizationId(): string | null {
  return getClientStorage().getItem(ACTIVE_ORGANIZATION_STORAGE_KEY);
}

export function setStoredActiveOrganizationId(organizationId: string): void {
  getClientStorage().setItem(ACTIVE_ORGANIZATION_STORAGE_KEY, organizationId);
}

export function clearStoredActiveOrganizationId(): void {
  getClientStorage().removeItem(ACTIVE_ORGANIZATION_STORAGE_KEY);
}

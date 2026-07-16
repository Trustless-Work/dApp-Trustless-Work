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

/** Flip with `NETWORK_SWITCHING_ENABLED` in `NetworkToggle` when mainnet returns. */
const NETWORK_LOCKED_TO_TESTNET = true;

export function getStoredNetwork(): NetworkType {
  if (NETWORK_LOCKED_TO_TESTNET) {
    return "testnet";
  }

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

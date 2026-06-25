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

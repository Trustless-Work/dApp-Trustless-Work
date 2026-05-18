const noopStorage: Storage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
  clear: () => {},
  key: () => null,
  get length() {
    return 0;
  },
};

/** Browser localStorage, or a no-op stub during SSR / broken Node polyfills. */
export function getClientStorage(): Storage {
  if (typeof window === "undefined") {
    return noopStorage;
  }

  const { localStorage } = window;
  if (typeof localStorage?.getItem !== "function") {
    return noopStorage;
  }

  return localStorage;
}

export function getStoredNetwork(): "testnet" | "mainnet" {
  const stored = getClientStorage().getItem("network");
  return stored === "mainnet" ? "mainnet" : "testnet";
}

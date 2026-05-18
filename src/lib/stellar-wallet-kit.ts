import type { StellarWalletsKit } from "@creit.tech/stellar-wallets-kit";
import { getStoredNetwork } from "@/lib/client-storage";

const NETWORK_PASSPHRASE = {
  testnet: "Test SDF Network ; September 2015",
  mainnet: "Public Global Stellar Network ; September 2015",
} as const;

let kitInstance: StellarWalletsKit | null = null;
let kitPromise: Promise<StellarWalletsKit> | null = null;

/** Lazily loaded on the client — wallet SDKs require browser APIs. */
export async function getKit(): Promise<StellarWalletsKit> {
  if (typeof window === "undefined") {
    throw new Error("StellarWalletsKit is only available in the browser");
  }

  if (kitInstance) {
    return kitInstance;
  }

  if (!kitPromise) {
    kitPromise = import("./stellar-wallet-kit.client").then(({ createKit }) => {
      kitInstance = createKit();
      return kitInstance;
    });
  }

  return kitPromise;
}

interface signTransactionProps {
  unsignedTransaction: string;
  address: string;
}

export const signTransaction = async ({
  unsignedTransaction,
  address,
}: signTransactionProps): Promise<string> => {
  const currentNetwork = getStoredNetwork();

  const networkPassphrase = NETWORK_PASSPHRASE[currentNetwork];

  const kit = await getKit();
  const { signedTxXdr } = await kit.signTransaction(unsignedTransaction, {
    address,
    networkPassphrase,
  });

  return signedTxXdr;
};

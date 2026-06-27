import type { ModuleInterface } from "@creit-tech/stellar-wallets-kit/types";
import { getStoredNetwork } from "@/lib/client-storage";
import type { NetworkType } from "@/types/network.entity";

type SdkModule = typeof import("@creit-tech/stellar-wallets-kit/sdk");
type TypesModule = typeof import("@creit-tech/stellar-wallets-kit/types");
type ModulesUtilsModule =
  typeof import("@creit-tech/stellar-wallets-kit/modules/utils");
type WalletConnectModuleType =
  typeof import("@creit-tech/stellar-wallets-kit/modules/wallet-connect");
type StellarWalletsKitStatic = SdkModule["StellarWalletsKit"];
type NetworksEnum = TypesModule["Networks"];
type WalletConnectTargetChainEnum =
  WalletConnectModuleType["WalletConnectTargetChain"];

function resolveKitNetwork(
  Networks: NetworksEnum,
  network: NetworkType,
): NetworksEnum[keyof NetworksEnum] {
  return network === "mainnet" ? Networks.PUBLIC : Networks.TESTNET;
}

function resolveWalletConnectChain(
  WalletConnectTargetChain: WalletConnectTargetChainEnum,
  network: NetworkType,
): WalletConnectTargetChainEnum[keyof WalletConnectTargetChainEnum] {
  return network === "mainnet"
    ? WalletConnectTargetChain.PUBLIC
    : WalletConnectTargetChain.TESTNET;
}

/**
 * Stellar Wallet Kit helpers
 *
 * We only load and initialize the kit
 * on the client, and only in response to effects or user actions.
 */
let walletKitPromise: Promise<{
  StellarWalletsKit: StellarWalletsKitStatic;
  Networks: NetworksEnum;
}> | null = null;

export function resetWalletKitLoader(): void {
  walletKitPromise = null;
}

const loadWalletKit = async () => {
  if (typeof window === "undefined") {
    throw new Error("StellarWalletsKit is only available in the browser");
  }

  if (!walletKitPromise) {
    walletKitPromise = (async () => {
      const [sdk, types, modules, walletConnect] = await Promise.all([
        import("@creit-tech/stellar-wallets-kit/sdk") as Promise<SdkModule>,
        import("@creit-tech/stellar-wallets-kit/types") as Promise<TypesModule>,
        import("@creit-tech/stellar-wallets-kit/modules/utils") as Promise<ModulesUtilsModule>,
        import("@creit-tech/stellar-wallets-kit/modules/wallet-connect") as Promise<WalletConnectModuleType>,
      ]);

      const { StellarWalletsKit } = sdk;
      const { Networks } = types;
      const { defaultModules } = modules;
      const { WalletConnectModule, WalletConnectTargetChain } = walletConnect;

      const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;
      const appOrigin = window.location.origin;
      const storedNetwork = getStoredNetwork();
      const kitNetwork = resolveKitNetwork(Networks, storedNetwork);
      const walletConnectChain = resolveWalletConnectChain(
        WalletConnectTargetChain,
        storedNetwork,
      );

      const kitModules = [...defaultModules()];

      if (projectId) {
        kitModules.push(
          new WalletConnectModule({
            projectId,
            metadata: {
              name: "Trustless Work",
              description:
                "Create escrows on the Stellar blockchain with Trustless Work.",
              icons: [`${appOrigin}/e.png`],
              url: appOrigin,
            },
            allowedChains: [walletConnectChain],
          }),
        );
      }

      StellarWalletsKit.init({
        network: kitNetwork,
        modules: kitModules,
      });

      return { StellarWalletsKit, Networks };
    })();
  }

  return walletKitPromise;
};

interface SignTransactionParams {
  unsignedTransaction: string;
  address: string;
  networkPassphrase?: string;
}

/**
 * Open the authentication modal and request the user's address.
 */
export const openAuthModal = async (): Promise<{ address: string }> => {
  const { StellarWalletsKit } = await loadWalletKit();
  return StellarWalletsKit.authModal();
};

/**
 * Get the currently selected wallet module.
 */
export const getSelectedWallet = async (): Promise<ModuleInterface> => {
  const { StellarWalletsKit } = await loadWalletKit();
  return StellarWalletsKit.selectedModule;
};

/**
 * Disconnect the current wallet.
 */
export const disconnectWalletKit = async (): Promise<void> => {
  const { StellarWalletsKit } = await loadWalletKit();
  return StellarWalletsKit.disconnect();
};

/**
 * Helper to sign a transaction XDR with the active wallet.
 */
export const signTransaction = async ({
  unsignedTransaction,
  address,
  networkPassphrase,
}: SignTransactionParams): Promise<string> => {
  const { StellarWalletsKit, Networks } = await loadWalletKit();

  const resolvedPassphrase =
    networkPassphrase ?? resolveKitNetwork(Networks, getStoredNetwork());

  const { signedTxXdr } = await StellarWalletsKit.signTransaction(
    unsignedTransaction,
    {
      address,
      networkPassphrase: resolvedPassphrase,
    },
  );

  return signedTxXdr;
};

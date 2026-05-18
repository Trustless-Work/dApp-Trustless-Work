import type { ISupportedWallet } from "@creit.tech/stellar-wallets-kit";
import { useGlobalAuthenticationStore } from "@/store/data";

export const useWallet = () => {
  const { connectWalletStore, disconnectWalletStore, address } =
    useGlobalAuthenticationStore();

  const connectWallet = async () => {
    const { getKit } = await import("@/lib/stellar-wallet-kit");
    const kit = await getKit();
    await kit.openModal({
      modalTitle: "Connect to your favorite wallet",
      onWalletSelected: async (option: ISupportedWallet) => {
        kit.setWallet(option.id);

        const { address } = await kit.getAddress();
        const { name } = option;

        connectWalletStore(address, name);
      },
    });
  };

  const disconnectWallet = async () => {
    const { getKit } = await import("@/lib/stellar-wallet-kit");
    const kit = await getKit();
    await kit.disconnect();
    disconnectWalletStore();
  };

  const handleConnect = async () => {
    try {
      await connectWallet();
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  const handleDisconnect = async () => {
    try {
      if (disconnectWallet) {
        await disconnectWallet();
      }
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
    }
  };

  return {
    connectWallet,
    disconnectWallet,
    handleConnect,
    handleDisconnect,
    isConnected: !!address,
  };
};

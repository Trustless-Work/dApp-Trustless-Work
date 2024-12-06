import { ISupportedWallet } from "@creit.tech/stellar-wallets-kit";
import { useWalletStore } from "@/store/walletStore";
import { kit } from "../walletKit";

export const useWallet = () => {
  const { connectWalletStore, disconnectWalletStore } = useWalletStore();

  const connectWallet = async () => {
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
    await kit.disconnect();
    disconnectWalletStore();
  };

  return {
    connectWallet,
    disconnectWallet,
  };
};

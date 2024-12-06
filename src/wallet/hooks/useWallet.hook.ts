import { ISupportedWallet } from "@creit.tech/stellar-wallets-kit";
import { useWalletStore } from "@/store/walletStore";
import { kit } from "../walletKit";
import { redirect } from "next/navigation";

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
    redirect("/");
  };

  return {
    connectWallet,
    disconnectWallet,
  };
};

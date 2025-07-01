import { kit } from "@/components/modules/auth/wallet/constants/wallet-kit.constant";
import { WalletNetwork } from "@creit.tech/stellar-wallets-kit";

interface signTransactionProps {
  unsignedTransaction: string;
  address: string;
}

export const signTransaction = async ({
  unsignedTransaction,
  address,
}: signTransactionProps): Promise<string> => {
  // Get current network from localStorage since this is a utility function
  const currentNetwork =
    (localStorage.getItem("network") as "testnet" | "mainnet") || "testnet";

  const networkPassphrase =
    currentNetwork === "mainnet" ? WalletNetwork.PUBLIC : WalletNetwork.TESTNET;

  const { signedTxXdr } = await kit.signTransaction(unsignedTransaction, {
    address,
    networkPassphrase,
  });

  return signedTxXdr;
};

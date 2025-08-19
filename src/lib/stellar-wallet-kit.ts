import {
  StellarWalletsKit,
  FREIGHTER_ID,
  FreighterModule,
  AlbedoModule,
  WalletNetwork,
} from "@creit.tech/stellar-wallets-kit";

export const kit: StellarWalletsKit = new StellarWalletsKit({
  network: WalletNetwork.TESTNET,
  selectedWalletId: FREIGHTER_ID,
  modules: [new FreighterModule(), new AlbedoModule()],
});

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

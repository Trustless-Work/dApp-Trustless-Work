import {
  StellarWalletsKit,
  FREIGHTER_ID,
  FreighterModule,
  AlbedoModule,
  xBullModule,
  LobstrModule,
  WalletNetwork,
} from "@creit.tech/stellar-wallets-kit";
import { LedgerModule } from "@creit.tech/stellar-wallets-kit/modules/ledger.module";
import {
  WalletConnectAllowedMethods,
  WalletConnectModule,
} from "@creit.tech/stellar-wallets-kit/modules/walletconnect.module";

export const kit: StellarWalletsKit = new StellarWalletsKit({
  network: WalletNetwork.TESTNET,
  selectedWalletId: FREIGHTER_ID,
  modules: [
    new FreighterModule(),
    new AlbedoModule(),
    new WalletConnectModule({
      url: "https://dapp.trustlesswork.com",
      projectId: "fa57d523d12455e4fc2c8c83c94ec7b1",
      method: WalletConnectAllowedMethods.SIGN,
      description: "Trustless Work",
      name: "Trustless Work",
      icons: ["/favicon.ico"],
      network: WalletNetwork.TESTNET,
    }),
    new xBullModule(),
    new LedgerModule(),
    new LobstrModule(),
  ],
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

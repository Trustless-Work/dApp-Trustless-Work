import { kit } from "@/components/modules/auth/wallet/constants/wallet-kit.constant";
import http from "@/core/config/axios/http";
import { WalletNetwork } from "@creit.tech/stellar-wallets-kit";
import { AxiosResponse } from "axios";

interface sendTransactionProps {
  signedXdr: string;
  returnEscrowDataIsRequired: boolean;
}

export const sendTransaction = async ({
  signedXdr,
  returnEscrowDataIsRequired,
}: sendTransactionProps): Promise<AxiosResponse> => {
  const tx = await http.post("/helper/send-transaction", {
    signedXdr,
    returnEscrowDataIsRequired: returnEscrowDataIsRequired,
  });

  return tx;
};

interface signTransactionProps {
  unsignedTransaction: string;
  address: string;
}

export const signTransaction = async ({
  unsignedTransaction,
  address,
}: signTransactionProps): Promise<string> => {
  const { signedTxXdr } = await kit.signTransaction(unsignedTransaction, {
    address,
    networkPassphrase: WalletNetwork.TESTNET,
  });

  return signedTxXdr;
};

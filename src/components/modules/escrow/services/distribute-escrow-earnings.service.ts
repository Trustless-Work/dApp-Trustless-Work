import { DistributeEscrowEarningsEscrowPayload } from "@/@types/escrow.entity";
import http from "@/core/config/axios/http";
import { kit } from "@/components/modules/auth/wallet/constants/wallet-kit.constant";
import { AxiosError } from "axios";
import { signTransaction } from "@/lib/stellar-wallet-kit";
import { handleError } from "@/errors/utils/handle-errors";
import { WalletError } from "@/@types/errors.entity";

export const distributeEscrowEarnings = async (
  payload: DistributeEscrowEarningsEscrowPayload,
) => {
  try {
    const { address } = await kit.getAddress();

    const response = await http.post(
      "/escrow/distribute-escrow-earnings",
      payload,
    );
    const { unsignedTransaction } = response.data;

    const signedTxXdr = await signTransaction({ unsignedTransaction, address });

    const tx = await http.post("/helper/send-transaction", {
      signedXdr: signedTxXdr,
    });

    const { data } = tx;
    return data;
  } catch (error: unknown) {
    const mappedError = handleError(error as AxiosError | WalletError);
    console.error("Error:", mappedError.message);
    throw new Error(mappedError.message);
  }
};

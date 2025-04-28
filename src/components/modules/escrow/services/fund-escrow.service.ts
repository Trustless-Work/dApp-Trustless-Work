import { FundEscrowPayload } from "@/@types/escrow.entity";
import http from "@/core/config/axios/http";
import { kit } from "@/components/modules/auth/wallet/constants/wallet-kit.constant";
import { AxiosError } from "axios";
import { signTransaction } from "@/lib/stellar-wallet-kit";
import { handleError } from "@/errors/utils/handle-errors";
import { WalletError } from "@/@types/errors.entity";

export const fundEscrow = async (payload: FundEscrowPayload) => {
  try {
    const { address } = await kit.getAddress();

    const {
      data: { unsignedTransaction },
    } = await http.post("/escrow/fund-escrow", payload);

    const signedTxXdr = await signTransaction({ unsignedTransaction, address });

    const { data } = await http.post("/helper/send-transaction", {
      signedXdr: signedTxXdr,
    });

    return data;
  } catch (error: unknown) {
    const mappedError = handleError(error as AxiosError | WalletError);
    console.error("Error:", mappedError.message);
    throw new Error(mappedError.message);
  }
};

import { AxiosError } from "axios";
import { handleError } from "@/errors/utils/handle-errors";
import { WalletError } from "@/@types/errors.entity";
import { EscrowPayloadService } from "@/@types/escrows/escrow-payload.entity";
import { EscrowRequestResponse } from "@/@types/escrows/escrow-response.entity";
import { Escrow } from "@/@types/escrows/escrow.entity";
import http from "@/core/config/axios/http";
import { kit } from "../../auth/wallet/constants/wallet-kit.constant";
import { signTransaction } from "@/lib/stellar-wallet-kit";
import { HttpMethod } from "@/@types/http.entity";

interface TrustlessWorkServiceProps<T extends EscrowPayloadService> {
  payload: T;
  endpoint: string;
  method: HttpMethod;
  requiresSignature?: boolean;
  returnEscrowDataIsRequired?: boolean;
}

export const trustlessWorkService = async <T extends EscrowPayloadService>({
  payload,
  endpoint,
  method,
  requiresSignature = true,
  returnEscrowDataIsRequired = true,
}: TrustlessWorkServiceProps<T>): Promise<EscrowRequestResponse | Escrow> => {
  try {
    if (!requiresSignature) {
      if (method === "get") {
        const { data } = await http.get<EscrowRequestResponse>(endpoint, {
          params: payload,
        });
        return data;
      }
    }

    const { address } = await kit.getAddress();
    const response = await http[method]<EscrowRequestResponse>(
      endpoint,
      payload,
    );

    const { unsignedTransaction } = response.data;

    if (!unsignedTransaction) {
      throw new Error("No unsigned transaction received from the server");
    }

    const signedTxXdr = await signTransaction({ unsignedTransaction, address });

    const tx = await http.post("/helper/send-transaction", {
      signedXdr: signedTxXdr,
      returnEscrowDataIsRequired,
    });

    return tx.data;
  } catch (error: unknown) {
    const mappedError = handleError(error as AxiosError | WalletError);
    console.error("Error:", mappedError.message);
    throw new Error(mappedError.message);
  }
};

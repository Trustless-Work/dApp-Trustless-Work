import { WalletError } from "@/@types/errors.entity";
import { EscrowPayload } from "@/@types/escrow.entity";
import http from "@/core/config/axios/http";
import { handleError } from "@/errors/utils/handle-errors";
import { signTransaction } from "@/lib/stellar-wallet-kit";
import axios, { AxiosError } from "axios";

interface EscrowPayloadWithSigner extends EscrowPayload {
  signer?: string;
  trustlineDecimals: number | undefined;
}

export const initializeEscrow = async (
  payload: EscrowPayloadWithSigner,
  address: string,
) => {
  try {
    const payloadWithSigner: EscrowPayloadWithSigner = {
      ...payload,
      signer: address,
    };

    const response = await http.post(
      "/deployer/invoke-deployer-contract",
      payloadWithSigner,
    );

    const { unsignedTransaction } = response.data;

    const signedTxXdr = await signTransaction({ unsignedTransaction, address });

    const tx = await http.post("/helper/send-transaction", {
      signedXdr: signedTxXdr,
      returnEscrowDataIsRequired: true,
    });

    const { data } = tx;

    return data;
  } catch (error: unknown) {
    const mappedError = handleError(error as AxiosError | WalletError);
    console.error("Error:", mappedError.message);
    throw new Error(mappedError.message);
  }
};

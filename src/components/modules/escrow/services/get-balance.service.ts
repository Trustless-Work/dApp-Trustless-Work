import { WalletError } from "@/@types/errors.entity";
import http from "@/core/config/axios/http";
import { handleError } from "@/errors/utils/handle-errors";
import axios, { AxiosError } from "axios";

export const getBalance = async (signer: string, addresses: string[]) => {
  try {
    const response = await http.get("/helper/get-multiple-escrow-balance", {
      params: { addresses, signer },
    });

    return response;
  } catch (error: unknown) {
    const mappedError = handleError(error as AxiosError | WalletError);
    console.error("Error:", mappedError.message);
    throw new Error(mappedError.message);
  }
};

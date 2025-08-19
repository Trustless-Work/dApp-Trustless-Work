import { ApiErrorTypes } from "@/errors/error.enum";

export type ApiError = Pick<ErrorResponse, "message" | "code">;

export type WalletError = Pick<ErrorResponse, "message" | "code">;

export type RequestError = ApiError | Error | WalletError;

export type ErrorResponse = {
  message: string;
  code: number;
  type: ApiErrorTypes;
};

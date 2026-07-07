import {
  formatApiErrorMessage,
  toTrustlessWorkError,
  TrustlessWorkApiError,
} from "@trustless-work/escrow";

export function getEscrowErrorMessage(error: unknown): string {
  const normalized = toTrustlessWorkError(error);

  if (normalized instanceof TrustlessWorkApiError) {
    return formatApiErrorMessage(normalized);
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong";
}

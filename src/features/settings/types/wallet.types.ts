import type { IsoDateTimeString, StellarAddress } from "@/types";

export interface UserWalletResponse {
  address: StellarAddress;
  verified: boolean;
  linkedAt?: IsoDateTimeString;
}

export interface WalletLinkVerifyResponse {
  verified: boolean;
  address: StellarAddress;
}

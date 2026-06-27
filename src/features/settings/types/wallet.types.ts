import type {
  IsoDateTimeString,
  StellarAddress,
} from "@/features/auth/types/auth.types";

export interface UserWalletResponse {
  address: StellarAddress;
  verified: boolean;
  linkedAt?: IsoDateTimeString;
}

export interface WalletLinkVerifyResponse {
  verified: boolean;
  address: StellarAddress;
}

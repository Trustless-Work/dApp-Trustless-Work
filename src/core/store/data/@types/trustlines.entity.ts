import { Trustline } from "@trustless-work/escrow";

export interface TrustlineGlobalStore {
  trustlines: (Trustline & { name: string })[];

  getAllTrustlines: () => void;
}

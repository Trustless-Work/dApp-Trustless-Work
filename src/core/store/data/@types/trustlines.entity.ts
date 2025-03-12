import { Trustline } from "@/@types/trustline.entity";

export interface TrustlineGlobalStore {
  trustlines: Trustline[];

  getAllTrustlines: () => void;
}

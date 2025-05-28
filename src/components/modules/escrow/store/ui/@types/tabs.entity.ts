import { RolesInEscrow } from "@/@types/escrows/escrow.entity";

export interface TabsEscrowStore {
  activeTab: RolesInEscrow;
  setActiveTab: (value: RolesInEscrow) => void;
}

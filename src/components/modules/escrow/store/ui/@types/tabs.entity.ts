import { RolesInEscrow } from "@/@types/escrow.entity";

export interface TabsEscrowStore {
  activeTab: RolesInEscrow;
  setActiveTab: (value: RolesInEscrow) => void;
}

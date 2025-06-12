import { RolesInEscrow } from "@/@types/escrow.entity";
import { EscrowType } from "@trustless-work/escrow";

export interface TabsEscrowStore {
  activeTab: RolesInEscrow;
  escrowType: EscrowType | null;
  setActiveTab: (value: RolesInEscrow) => void;
  setEscrowType: (value: EscrowType | null) => void;
}

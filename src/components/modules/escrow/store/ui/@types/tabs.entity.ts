import { EscrowType, Role } from "@trustless-work/escrow";

export interface TabsEscrowStore {
  activeTab: Role;
  escrowType: EscrowType | null;
  setActiveTab: (value: Role) => void;
  setEscrowType: (value: EscrowType | null) => void;
}

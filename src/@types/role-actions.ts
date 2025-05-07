import { RolesInEscrow } from "@/@types/escrow.entity";

export interface RoleAction {
  role: RolesInEscrow;
  label: string;
  actions: string[];
  icon: React.ReactNode;
  color: string;
}

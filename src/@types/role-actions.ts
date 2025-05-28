import { RolesInEscrow } from "./escrows/escrow.entity";

export interface RoleAction {
  role: RolesInEscrow;
  label: string;
  actions: string[];
  icon: React.ReactNode;
  color: string;
}

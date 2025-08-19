import { Role } from "@trustless-work/escrow/types";

export interface RoleAction {
  role: Role;
  label?: string;
  actions: string[];
  icon: React.ReactNode;
  color: string;
}

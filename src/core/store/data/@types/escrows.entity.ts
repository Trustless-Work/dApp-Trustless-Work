import { Escrow } from "@/@types/escrow.entity";

export interface EscrowGlobalStore {
  selectedEscrow: Escrow | null;
  userRolesInEscrow: string[];
  recentEscrow: Escrow | undefined;

  setUserRolesInEscrow: (roles: string[]) => void;
  // softDeleteEscrow: (escrowId: string) => Promise<void>;
  // restoreEscrow: (escrowId: string) => Promise<void>;
  setRecentEscrow: (escrow: Escrow | undefined) => void;
  setSelectedEscrow: (escrow: Escrow | undefined) => void;
}

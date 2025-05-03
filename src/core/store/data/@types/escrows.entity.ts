/* eslint-disable @typescript-eslint/no-explicit-any */

import { Escrow, EscrowPayload } from "@/@types/escrow.entity";

export interface EscrowGlobalStore {
  escrows: Escrow[];
  totalEscrows: number;
  loadingEscrows: boolean;
  selectedEscrow: Escrow | null;
  escrowsToDelete: string[];
  userRolesInEscrow: string[];
  recentEscrow: Escrow | undefined;

  setEscrows: (escrows: Escrow[]) => void;
  fetchAllEscrows: (params: {
    address: string;
    type: string;
    isActive?: boolean;
  }) => void;
  updateEscrow: (params: {
    escrowId: string;
    payload: Partial<EscrowPayload>;
  }) => Promise<Escrow | undefined>;
  setUserRolesInEscrow: (roles: string[]) => void;
  softDeleteEscrow: (escrowId: string) => Promise<void>;
  restoreEscrow: (escrowId: string) => Promise<void>;
  setRecentEscrow: (escrow: Escrow | undefined) => void;
  setSelectedEscrow: (escrow: Escrow | undefined) => void;
}

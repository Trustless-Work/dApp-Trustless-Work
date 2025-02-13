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
  approverFunds: string;
  serviceProviderFunds: string;

  setEscrows: (escrows: Escrow[]) => void;
  setSelectedEscrow: (selectedEscrow?: Escrow) => void;
  // setEscrowsToDelete: (escrows: string[]) => void;
  fetchAllEscrows: (params: { address: string; type: string }) => void;
  addEscrow: (
    payload: EscrowPayload,
    address: string,
    contractId: string,
  ) => Promise<Escrow | undefined>;
  updateEscrow: (params: {
    escrowId: string;
    payload: EscrowPayload;
  }) => Promise<Escrow | undefined>;
  setUserRolesInEscrow: (roles: string[]) => void;
  setRecentEscrow: (escrow: Escrow | undefined) => void;
  setApproverFunds: (approverFunds: string) => void;
  setServiceProviderFunds: (serviceProviderFunds: string) => void;
  // deleteProduct: (escrowId: strin`g) => void;
}

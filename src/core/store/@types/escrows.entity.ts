import { Escrow } from "@/@types/escrow.entity";

export interface EscrowGlobalStore {
  escrows: Escrow[];
  totalEscrows: number;
  loadingEscrows: boolean;
  escrowToUpdate?: Escrow;
  escrowsToDelete: string[];

  setEscrows: (escrows: Escrow[]) => void;
  setEscrowToUpdate: (escrow?: Escrow) => void;
  // setEscrowsToDelete: (escrows: string[]) => void;
  fetchAllEscrows: (params: { address: string; type: string }) => void;
  // addEscrow: (escrow: Escrow) => Promise<Escrow | undefined>;
  // updateEscrow: (
  //   escrowId: string,
  //   escrow: Escrow,
  // ) => Promise<Escrow | undefined>;
  // deleteProduct: (escrowId: string) => void;
}

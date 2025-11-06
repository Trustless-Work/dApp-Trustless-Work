import { StateCreator } from "zustand";
import { GetEscrowsFromIndexerResponse as Escrow } from "@trustless-work/escrow/types";
import { convertFirestoreTimestamps } from "@/lib/format";

const ESCROW_ACTIONS = {
  SET_USER_ROLES_IN_ESCROW: "escrows/setUserRolesInEscrow",
  SET_RECENT_ESCROW: "escrows/setRecentEscrow",
} as const;

export type EscrowGlobalStore = {
  userRolesInEscrow: string[];
  recentEscrow: Escrow | undefined;

  setUserRolesInEscrow: (roles: string[]) => void;
  setRecentEscrow: (escrow: Escrow | undefined) => void;
};

export const escrowsSlice: StateCreator<
  EscrowGlobalStore,
  [["zustand/devtools", never]],
  [],
  EscrowGlobalStore
> = (set) => {
  return {
    // Stores
    userRolesInEscrow: [],
    recentEscrow: undefined,

    setUserRolesInEscrow: (roles) =>
      set(
        { userRolesInEscrow: roles },
        false,
        ESCROW_ACTIONS.SET_USER_ROLES_IN_ESCROW,
      ),

    setRecentEscrow: (escrow) =>
      set(
        {
          recentEscrow: escrow
            ? (convertFirestoreTimestamps(escrow) as Escrow)
            : undefined,
        },
        false,
        ESCROW_ACTIONS.SET_RECENT_ESCROW,
      ),
  };
};

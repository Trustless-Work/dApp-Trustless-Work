import { StateCreator } from "zustand";
import { EscrowGlobalStore } from "../@types/escrows.entity";
import { Escrow } from "@/@types/escrow.entity";
import { convertFirestoreTimestamps } from "@/utils/hook/format.hook";

const ESCROW_ACTIONS = {
  SET_SELECTED_ESCROW: "escrows/setSelectedEscrow",
  SET_USER_ROLES_IN_ESCROW: "escrows/setUserRolesInEscrow",
  SET_RECENT_ESCROW: "escrows/setRecentEscrow",
} as const;

export const useGlobalEscrowsSlice: StateCreator<
  EscrowGlobalStore,
  [["zustand/devtools", never]],
  [],
  EscrowGlobalStore
> = (set) => {
  return {
    // Stores
    selectedEscrow: null,
    userRolesInEscrow: [],
    recentEscrow: undefined,

    setSelectedEscrow: (escrow) =>
      set(
        {
          selectedEscrow: escrow
            ? (convertFirestoreTimestamps(escrow) as Escrow)
            : null,
        },
        false,
        ESCROW_ACTIONS.SET_SELECTED_ESCROW,
      ),

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

    // softDeleteEscrow: async (escrowId: string) => {
    //   await get().updateEscrow({ escrowId, payload: { isActive: false } });
    //   try {
    //     set(
    //       (state) => ({
    //         escrows: state.escrows.filter((e) => e.id !== escrowId),
    //       }),
    //       false,
    //       "escrows/softDeleteFiltered",
    //     );
    //     set(
    //       { loadingEscrows: false },
    //       false,
    //       ESCROW_ACTIONS.SET_LOADING_ESCROWS,
    //     );
    //   } catch (error) {
    //     set(
    //       { loadingEscrows: false },
    //       false,
    //       ESCROW_ACTIONS.SET_LOADING_ESCROWS,
    //     );
    //     throw error;
    //   }
    // },

    // restoreEscrow: async (escrowId: string) => {
    //   set({ loadingEscrows: true }, false, ESCROW_ACTIONS.SET_LOADING_ESCROWS);
    //   try {
    //     await get().updateEscrow({ escrowId, payload: { isActive: true } });
    //     set(
    //       (state) => ({
    //         escrows: state.escrows.filter((e) => e.id !== escrowId),
    //       }),
    //       false,
    //       "escrows/restoreFiltered",
    //     );
    //     set(
    //       { loadingEscrows: false },
    //       false,
    //       ESCROW_ACTIONS.SET_LOADING_ESCROWS,
    //     );
    //   } catch (error) {
    //     set(
    //       { loadingEscrows: false },
    //       false,
    //       ESCROW_ACTIONS.SET_LOADING_ESCROWS,
    //     );
    //     throw error;
    //   }
    // },
  };
};

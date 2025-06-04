import { StateCreator } from "zustand";
import { EscrowGlobalStore } from "../@types/escrows.entity";
import {
  fetchAllEscrows,
  updateExistingEscrow,
} from "@/components/modules/escrow/services/escrow.service";
import { Escrow } from "@/@types/escrow.entity";
import { convertFirestoreTimestamps } from "@/utils/hook/format.hook";

const ESCROW_ACTIONS = {
  SET_ESCROWS: "escrows/setEscrows",
  SET_LOADING_ESCROWS: "escrows/setLoadingEscrows",
  SET_SELECTED_ESCROW: "escrows/setSelectedEscrow",
  SET_USER_ROLES_IN_ESCROW: "escrows/setUserRolesInEscrow",
  SET_RECENT_ESCROW: "escrows/setRecentEscrow",
  UPDATE_ESCROW: "escrows/updateEscrow",
} as const;

export const useGlobalEscrowsSlice: StateCreator<
  EscrowGlobalStore,
  [["zustand/devtools", never]],
  [],
  EscrowGlobalStore
> = (set, get) => {
  return {
    // Stores
    escrows: [],
    totalEscrows: 0,
    loadingEscrows: false,
    selectedEscrow: null,
    escrowsToDelete: [],
    userRolesInEscrow: [],
    recentEscrow: undefined,

    // Actions
    setEscrows: (escrows) =>
      set({ escrows }, false, ESCROW_ACTIONS.SET_ESCROWS),

    fetchAllEscrows: async ({ address, type, isActive }) => {
      set({ loadingEscrows: true }, false, ESCROW_ACTIONS.SET_LOADING_ESCROWS);
      try {
        const escrows = await fetchAllEscrows({ address, type, isActive });
        set(
          { escrows, loadingEscrows: false },
          false,
          ESCROW_ACTIONS.SET_ESCROWS,
        );
      } catch (error) {
        set(
          { loadingEscrows: false },
          false,
          ESCROW_ACTIONS.SET_LOADING_ESCROWS,
        );
        throw error;
      }
    },

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

    updateEscrow: async ({ escrowId, payload }) => {
      set({ loadingEscrows: true }, false, ESCROW_ACTIONS.SET_LOADING_ESCROWS);
      try {
        const updatedEscrow = await updateExistingEscrow({ escrowId, payload });
        if (updatedEscrow) {
          set(
            (state) => ({
              escrows: state.escrows.map((escrow) =>
                escrow.id === escrowId
                  ? { ...escrow, ...updatedEscrow }
                  : escrow,
              ),
            }),
            false,
            ESCROW_ACTIONS.UPDATE_ESCROW,
          );
        }
        set(
          { loadingEscrows: false },
          false,
          ESCROW_ACTIONS.SET_LOADING_ESCROWS,
        );
        return updatedEscrow;
      } catch (error) {
        set(
          { loadingEscrows: false },
          false,
          ESCROW_ACTIONS.SET_LOADING_ESCROWS,
        );
        throw error;
      }
    },

    softDeleteEscrow: async (escrowId: string) => {
      await get().updateEscrow({ escrowId, payload: { isActive: false } });
      try {
        set(
          (state) => ({
            escrows: state.escrows.filter((e) => e.id !== escrowId),
          }),
          false,
          "escrows/softDeleteFiltered",
        );
        set(
          { loadingEscrows: false },
          false,
          ESCROW_ACTIONS.SET_LOADING_ESCROWS,
        );
      } catch (error) {
        set(
          { loadingEscrows: false },
          false,
          ESCROW_ACTIONS.SET_LOADING_ESCROWS,
        );
        throw error;
      }
    },

    restoreEscrow: async (escrowId: string) => {
      set({ loadingEscrows: true }, false, ESCROW_ACTIONS.SET_LOADING_ESCROWS);
      try {
        await get().updateEscrow({ escrowId, payload: { isActive: true } });
        set(
          (state) => ({
            escrows: state.escrows.filter((e) => e.id !== escrowId),
          }),
          false,
          "escrows/restoreFiltered",
        );
        set(
          { loadingEscrows: false },
          false,
          ESCROW_ACTIONS.SET_LOADING_ESCROWS,
        );
      } catch (error) {
        set(
          { loadingEscrows: false },
          false,
          ESCROW_ACTIONS.SET_LOADING_ESCROWS,
        );
        throw error;
      }
    },
  };
};

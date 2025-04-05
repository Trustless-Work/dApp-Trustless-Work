import type { StateCreator } from "zustand";
import type { EscrowGlobalStore } from "../@types/escrows.entity";
import type { Escrow } from "@/@types/escrow.entity";
import {
  fetchAllEscrows,
  updateExistingEscrow,
} from "@/components/modules/escrow/services/escrow.service";

const ESCROW_ACTIONS = {
  SET_ESCROWS: "escrows/set",
  SET_SELECTED_ESCROW: "escrows/setSelected",
  FETCH_ALL_ESCROWS: "escrows/fetchAll",
  ADD_ESCROW: "escrows/add",
  UPDATE_ESCROW: "escrows/update",
  DELETE_PRODUCT: "escrows/delete",
  SET_ESCROW_TO_DELETE: "escrows/setToDelete",
  SET_LOADING_ESCROWS: "escrows/setLoading",
  SET_USER_ROLE: "escrows/setUserRole",
} as const;

export const ESCROW_SLICE_NAME = "escrowSlice" as const;

export const useGlobalEscrowsSlice: StateCreator<
  EscrowGlobalStore,
  [["zustand/devtools", never]],
  [],
  EscrowGlobalStore
> = (set) => {
  return {
    // State
    escrows: [],
    totalEscrows: 0,
    loadingEscrows: false,
    escrowsToDelete: [],
    selectedEscrow: null,
    userRolesInEscrow: [],
    recentEscrow: undefined,
    approverFunds: "",
    serviceProviderFunds: "",

    // Actions
    setEscrows: (escrows: Escrow[]) =>
      set({ escrows }, false, ESCROW_ACTIONS.SET_ESCROWS),

    setSelectedEscrow: (escrow: Escrow | undefined) =>
      set(
        { selectedEscrow: escrow },
        false,
        ESCROW_ACTIONS.SET_SELECTED_ESCROW,
      ),

    fetchAllEscrows: async ({ address, type = "approver" }) => {
      set({ loadingEscrows: true }, false, ESCROW_ACTIONS.SET_LOADING_ESCROWS);
      try {
        const escrows = await fetchAllEscrows({ address, type });
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

    updateEscrow: async ({ escrowId, payload }) => {
      set({ loadingEscrows: true }, false, ESCROW_ACTIONS.SET_LOADING_ESCROWS);
      try {
        const updatedEscrow = await updateExistingEscrow({ escrowId, payload });
        if (updatedEscrow) {
          set(
            (state) => ({
              escrows: state.escrows.map((escrow) =>
                escrow.id === escrowId ? updatedEscrow : escrow,
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

    setUserRolesInEscrow: (role) =>
      set({ userRolesInEscrow: role }, false, ESCROW_ACTIONS.SET_USER_ROLE),

    setRecentEscrow: (escrow: Escrow | undefined) => {
      set({ recentEscrow: escrow });
    },
  };
};

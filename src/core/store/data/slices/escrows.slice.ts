import type { StateCreator } from "zustand";
import type { EscrowGlobalStore } from "../@types/escrows.entity";

import {
  fetchAllEscrows,
  updateExistingEscrow,
} from "@/components/modules/escrow/services/escrow.service";
import { Escrow } from "@/@types/escrows/escrow.entity";
import { convertFirestoreTimestamps } from "@/utils/hook/format.hook";

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
  SET_RECENT_ESCROW: "escrows/setRecent",
} as const;

export const ESCROW_SLICE_NAME = "escrowSlice" as const;

export const useGlobalEscrowsSlice: StateCreator<
  EscrowGlobalStore,
  [["zustand/devtools", never]],
  [],
  EscrowGlobalStore
> = (set, get) => {
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
        { selectedEscrow: escrow ? convertFirestoreTimestamps(escrow) : null },
        false,
        ESCROW_ACTIONS.SET_SELECTED_ESCROW,
      ),

    fetchAllEscrows: async ({
      address,
      type = "approver",
      isActive,
    }: {
      address: string;
      type: string;
      isActive?: boolean;
    }) => {
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

    setUserRolesInEscrow: (role) =>
      set({ userRolesInEscrow: role }, false, ESCROW_ACTIONS.SET_USER_ROLE),

    setRecentEscrow: (escrow: Escrow | undefined) =>
      set(
        {
          recentEscrow: escrow ? convertFirestoreTimestamps(escrow) : undefined,
        },
        false,
        ESCROW_ACTIONS.SET_RECENT_ESCROW,
      ),
  };
};

import { StateCreator } from "zustand";
import { EscrowGlobalStore } from "../@types/escrows.entity";
import { Escrow } from "@/@types/escrow.entity";
import {
  addEscrow,
  getAllEscrowsByUser,
  updateEscrow,
} from "@/components/modules/escrow/server/escrow-firebase";

const ESCROW_ACTIONS = {
  SET_ESCROWS: "escrows/set",
  SET_SELECTED_ESCROW: "escrows/setSelected",
  FETCH_ALL_ESCROWS: "escrows/fetchAll",
  ADD_ESCROW: "escrows/add",
  UPDATE_ESCROW: "escrows/update",
  DELETE_PRODUCT: "escrows/delete",
  SET_ESCROW_TO_DELETE: "escrows/setToDelete",
  SET_LOADING_ESCROWS: "escrows/setLoading",
} as const;

export const ESCROW_SLICE_NAME = "escrowSlice" as const;

export const useGlobalEscrowsSlice: StateCreator<
  EscrowGlobalStore,
  [["zustand/devtools", never]],
  [],
  EscrowGlobalStore
> = (set) => {
  return {
    // Stores
    escrows: [],
    totalEscrows: 0,
    loadingEscrows: false,
    escrowsToDelete: [],
    selectedEscrow: null,

    // Modifiers
    setEscrows: (escrows: Escrow[]) =>
      set({ escrows }, false, ESCROW_ACTIONS.SET_ESCROWS),

    setSelectedEscrow: (escrow) =>
      set(
        { selectedEscrow: escrow },
        false,
        ESCROW_ACTIONS.SET_SELECTED_ESCROW,
      ),

    fetchAllEscrows: async ({ address, type = "client" }) => {
      set({ loadingEscrows: true }, false, ESCROW_ACTIONS.SET_LOADING_ESCROWS);

      const escrows = await getAllEscrowsByUser({
        address,
        type,
      });

      set(
        { escrows: escrows.data, totalEscrows: escrows.data?.length },
        false,
        ESCROW_ACTIONS.FETCH_ALL_ESCROWS,
      );
      set({ loadingEscrows: false }, false, ESCROW_ACTIONS.SET_LOADING_ESCROWS);
    },

    addEscrow: async (payload, address, contractId) => {
      const newEscrowResponse = await addEscrow({
        payload,
        address,
        contractId,
      });
      if (newEscrowResponse && newEscrowResponse.data) {
        const newEscrow: Escrow = newEscrowResponse.data;
        set(
          (state) => ({
            escrows: [newEscrow, ...state.escrows],
          }),
          false,
          ESCROW_ACTIONS.ADD_ESCROW,
        );
        return newEscrow;
      }

      return undefined;
    },

    updateEscrow: async ({ escrowId, payload }) => {
      const escrowToUpdate = await updateEscrow({
        escrowId,
        payload: { ...payload, balance: payload.balance || 0 },
      });

      return escrowToUpdate;
    },

    //   fetchDeleteProduct: async (productId) => {
    //     const ok = await fetchDeleteProduct({ productId });

    //     if (ok) {
    //       set(
    //         (state) => ({
    //           products: state.products.filter((p) => p.id !== productId),
    //         }),
    //         false,
    //         ESCROW_ACTIONS.DELETE_PRODUCT,
    //       );
    //     }
    //   },

    //   setProductsToDelete: (products) =>
    //     set(
    //       { productsToDelete: products },
    //       false,
    //       ESCROW_ACTIONS.SET_PRODUCTS_TO_DELETE,
    //     ),
  };
};

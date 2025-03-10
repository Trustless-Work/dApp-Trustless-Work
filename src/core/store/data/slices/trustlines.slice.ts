import { StateCreator } from "zustand";
import { TrustlineGlobalStore } from "../@types/trustlines.entity";
import { getAllTrustlines } from "@/components/modules/token/server/trustline.firebase";

const TRUSTLINE_ACTIONS = {
  SET_TRUSTLINES: "trustlines/setTrustlines",
} as const;

export const useGlobalTrustlinesSlice: StateCreator<
  TrustlineGlobalStore,
  [["zustand/devtools", never]],
  [],
  TrustlineGlobalStore
> = (set) => {
  return {
    // Stores
    trustlines: [],

    // Modifiers
    getAllTrustlines: async () => {
      const { success, message, data } = await getAllTrustlines();

      if (success) {
        set({ trustlines: data }, false, TRUSTLINE_ACTIONS.SET_TRUSTLINES);
      } else {
        console.error(message);
      }
    },
  };
};

import { StateCreator } from "zustand";
import { FiltersContactStore } from "../@types/filters.entity";

export const useContactFiltersSlice: StateCreator<
  FiltersContactStore,
  [["zustand/devtools", never]],
  [],
  FiltersContactStore
> = (set) => {
  return {
    // Stores
    filters: {
      name: "",
      email: "",
      walletType: null,
    },

    // Modifiers
    setFilters: (newFilters) =>
      set((state) => ({
        filters: { ...state.filters, ...newFilters },
      })),
  };
};

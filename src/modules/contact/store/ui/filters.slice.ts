import { StateCreator } from "zustand";

export type FiltersContactStore = {
  filters: {
    name: string;
    email: string;
    walletType: string | null;
  };
  setFilters: (filters: Partial<FiltersContactStore["filters"]>) => void;
};

export const contactFiltersSlice: StateCreator<
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

import { create } from "zustand";

interface ContactUIState {
  activeMode: "table" | "cards";
  setActiveMode: (mode: "table" | "cards") => void;
  filters: {
    name: string;
    email: string;
    walletType: string | null;
  };
  setFilters: (filters: Partial<ContactUIState["filters"]>) => void;
}

export const useContactUIBoundedStore = create<ContactUIState>((set) => ({
  activeMode: "table",
  setActiveMode: (mode) => set({ activeMode: mode }),
  filters: {
    name: "",
    email: "",
    walletType: null,
  },
  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),
}));

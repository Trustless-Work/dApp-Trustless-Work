import { create } from "zustand";

interface ContactUIState {
  activeTab: string;
  activeMode: "table" | "cards";
  setActiveTab: (tab: string) => void;
  setActiveMode: (mode: "table" | "cards") => void;
}

export const useContactUIBoundedStore = create<ContactUIState>((set) => ({
  activeTab: "issuer",
  activeMode: "table",
  setActiveTab: (tab) => set({ activeTab: tab }),
  setActiveMode: (mode) => set({ activeMode: mode }),
}));

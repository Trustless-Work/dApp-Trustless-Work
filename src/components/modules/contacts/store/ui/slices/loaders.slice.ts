import { StateCreator } from "zustand";
import { LoadersContactStore } from "../@types/loaders.entity";

export const useLoadersContactSlice: StateCreator<
  LoadersContactStore,
  [["zustand/devtools", never]],
  [],
  LoadersContactStore
> = (set) => ({
  isCreatingContact: false,
  isEditingContact: false,

  setIsCreatingContact: (value: boolean) => set({ isCreatingContact: value }),
  setIsEditingContact: (value: boolean) => set({ isEditingContact: value }),
});

import { StateCreator } from "zustand";
import { LoaderGlobalUIStore } from "../@types/loader.entity";

export const useLoaderSlice: StateCreator<
  LoaderGlobalUIStore,
  [["zustand/devtools", never]],
  [],
  LoaderGlobalUIStore
> = (set) => {
  return {
    // Stores
    isLoading: false,

    // Modifiers
    setIsLoading: (isLoading: boolean) => set({ isLoading }),
  };
};

import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface LoaderState {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

export const useLoaderStore = create<LoaderState>()(
  devtools((set) => ({
    isLoading: false,
    setIsLoading: (isLoading: boolean) => set({ isLoading }),
  })),
);

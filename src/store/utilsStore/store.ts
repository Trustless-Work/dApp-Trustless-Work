import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

type LoaderState = {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
};

export const useLoaderStore = create<LoaderState>()(
  devtools((set) => ({
    isLoading: false,
    setIsLoading: (isLoading: boolean) => set({ isLoading }),
  })),
);

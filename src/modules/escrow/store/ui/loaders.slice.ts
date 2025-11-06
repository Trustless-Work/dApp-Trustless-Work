import { StateCreator } from "zustand";

export type LoadersEscrowStore = {
  isInitializingEscrow: boolean;

  setIsInitializingEscrow: (value: boolean) => void;
};

export const escrowLoadersSlice: StateCreator<
  LoadersEscrowStore,
  [["zustand/devtools", never]],
  [],
  LoadersEscrowStore
> = (set) => {
  return {
    // Stores
    isInitializingEscrow: false,

    // Modifiers
    setIsInitializingEscrow: (value: boolean) =>
      set({ isInitializingEscrow: value }),
  };
};

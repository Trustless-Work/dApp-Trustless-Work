import { StateCreator } from "zustand";

export type CopyGlobalUIStore = {
  copiedKeyId: string | null;
  setCopiedKeyId: (key: string | null) => void;
};

export const copySlice: StateCreator<
  CopyGlobalUIStore,
  [["zustand/devtools", never]],
  [],
  CopyGlobalUIStore
> = (set) => {
  return {
    // Stores
    copiedKeyId: null,

    // Modifiers
    setCopiedKeyId: (key: string | null) => set({ copiedKeyId: key }),
  };
};

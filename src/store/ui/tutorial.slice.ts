import { StateCreator } from "zustand";

export type TutorialGlobalUIStore = {
  run: boolean;
  setRun: (run: boolean) => void;
};

export const tutorialSlice: StateCreator<
  TutorialGlobalUIStore,
  [["zustand/devtools", never]],
  [],
  TutorialGlobalUIStore
> = (set) => {
  return {
    // Stores
    run: false,

    // Modifiers
    setRun: (run: boolean) => {
      set({ run });
    },
  };
};

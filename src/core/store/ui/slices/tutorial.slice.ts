import { StateCreator } from "zustand";
import { TutorialGlobalUIStore } from "../@types/tutorial.entity";

export const useTutorialSlice: StateCreator<
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

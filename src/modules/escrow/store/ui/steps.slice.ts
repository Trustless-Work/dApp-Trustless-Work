import { StateCreator } from "zustand";

export type StepsEscrowStore = {
  currentStep: number;
  totalSteps: number;
  completedSteps: Set<number>;
  setTotalSteps: (total: number) => void;
  toggleStep: (step: number) => void;
  isStepCompleted: (step: number) => boolean;
  setCurrentStep: (step: number) => void;
};

export const escrowStepsSlice: StateCreator<
  StepsEscrowStore,
  [["zustand/devtools", never]],
  [],
  StepsEscrowStore
> = (set, get) => {
  return {
    // Stores
    currentStep: 1,
    totalSteps: 1,
    completedSteps: new Set<number>(),

    // Modifiers
    setTotalSteps: (total) => set({ totalSteps: total }),

    toggleStep: (step) =>
      set((state) => {
        if (step < 1 || step > state.totalSteps) return state;

        const newCompletedSteps = new Set(state.completedSteps);

        for (let i = 1; i < step; i++) {
          newCompletedSteps.add(i);
        }

        if (step < state.currentStep) {
          for (let i = step + 1; i <= state.totalSteps; i++) {
            newCompletedSteps.delete(i);
          }
        }

        return {
          currentStep: step,
          completedSteps: newCompletedSteps,
        };
      }),

    isStepCompleted: (step) => get().completedSteps.has(step),

    setCurrentStep: (step) => set({ currentStep: step }),
  };
};

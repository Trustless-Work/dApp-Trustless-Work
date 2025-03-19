import { StateCreator } from "zustand";
import { StepsContactStore } from "../@types/steps.entity";

export const useContactStepsSlice: StateCreator<
  StepsContactStore,
  [["zustand/devtools", never]],
  [],
  StepsContactStore
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

import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface StepsState {
  currentStep: number;
  totalSteps: number;
  completedSteps: Set<number>;
  setCurrentStep: (step: number) => void;
  setTotalSteps: (total: number) => void;
  toggleStep: (step: number) => void;
  isStepCompleted: (step: number) => boolean;
  nextStep: () => void;
  previousStep: () => void;
  isFirstStep: () => boolean;
  isLastStep: () => boolean;
  resetSteps: () => void;
}

export const useStepsStore = create<StepsState>()(
  devtools((set, get) => ({
    currentStep: 1,
    totalSteps: 1,
    completedSteps: new Set<number>(),

    setCurrentStep: (step: number) => {
      if (step >= 1 && step <= get().totalSteps) {
        set({ currentStep: step });
      }
    },

    setTotalSteps: (total: number) => {
      set({ totalSteps: total });
      if (get().currentStep > total) {
        set({ currentStep: total });
      }
    },

    toggleStep: (step: number) => {
      const { completedSteps, totalSteps } = get();
      const newCompletedSteps = new Set(completedSteps);

      if (newCompletedSteps.has(step)) {
        for (let i = step; i <= totalSteps; i++) {
          newCompletedSteps.delete(i);
        }
        set({
          completedSteps: newCompletedSteps,
          currentStep: step,
        });
      } else {
        for (let i = 1; i <= step; i++) {
          newCompletedSteps.add(i);
        }
        set({
          completedSteps: newCompletedSteps,
          currentStep: Math.min(step + 1, totalSteps),
        });
      }
    },

    isStepCompleted: (step: number) => {
      return get().completedSteps.has(step);
    },

    nextStep: () => {
      const { currentStep, totalSteps } = get();
      if (currentStep < totalSteps) {
        set({ currentStep: currentStep + 1 });
      }
    },

    previousStep: () => {
      const { currentStep } = get();
      if (currentStep > 1) {
        set({ currentStep: currentStep - 1 });
      }
    },

    isFirstStep: () => get().currentStep === 1,
    isLastStep: () => get().currentStep === get().totalSteps,
    resetSteps: () => set({ currentStep: 1, completedSteps: new Set() }),
  })),
);

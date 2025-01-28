export interface StepsGlobalUIStore {
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

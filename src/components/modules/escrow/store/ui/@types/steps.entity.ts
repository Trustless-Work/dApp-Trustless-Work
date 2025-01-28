export interface StepsEscrowStore {
  currentStep: number;
  totalSteps: number;
  completedSteps: Set<number>;
  setTotalSteps: (total: number) => void;
  toggleStep: (step: number) => void;
  isStepCompleted: (step: number) => boolean;
  setCurrentStep: (step: number) => void;
}

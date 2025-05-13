export interface LoadersEscrowStore {
  isChangingStatus: boolean;
  isReleasingFunds: boolean;
  isStartingDispute: boolean;
  isFundingEscrow: boolean;
  isEditingMilestones: boolean;
  isEditingEntities: boolean;
  isEditingBasicProperties: boolean;
  isResolvingDispute: boolean;
  setIsChangingStatus: (value: boolean) => void;
  setIsReleasingFunds: (value: boolean) => void;
  setIsStartingDispute: (value: boolean) => void;
  setIsFundingEscrow: (value: boolean) => void;
  setIsEditingMilestones: (value: boolean) => void;
  setIsEditingEntities: (value: boolean) => void;
  setIsEditingBasicProperties: (value: boolean) => void;
  setIsResolvingDispute: (value: boolean) => void;
}

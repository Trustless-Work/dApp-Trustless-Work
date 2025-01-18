export interface LoadersEscrowStore {
  isChangingStatus: boolean;
  isDistributingEarnings: boolean;
  isStartingDispute: boolean;
  isFundingEscrow: boolean;
  setIsChangingStatus: (value: boolean) => void;
  setIsDistributingEarnings: (value: boolean) => void;
  setIsStartingDispute: (value: boolean) => void;
  setIsFundingEscrow: (value: boolean) => void;
}

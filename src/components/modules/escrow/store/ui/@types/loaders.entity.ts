export interface LoadersEscrowStore {
  isChangingStatus: boolean;
  isDistributingEarnings: boolean;
  isStartingDispute: boolean;
  setIsChangingStatus: (value: boolean) => void;
  setIsDistributingEarnings: (value: boolean) => void;
  setIsStartingDispute: (value: boolean) => void;
}

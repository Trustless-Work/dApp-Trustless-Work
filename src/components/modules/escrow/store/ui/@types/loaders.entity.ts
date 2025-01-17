export interface LoadersEscrowStore {
  isChangingStatus: boolean;
  isDistributingEarnings: boolean;
  setIsChangingStatus: (value: boolean) => void;
  setIsDistributingEarnings: (value: boolean) => void;
}

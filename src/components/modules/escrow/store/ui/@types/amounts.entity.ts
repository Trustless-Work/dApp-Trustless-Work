export interface AmountEscrowStore {
  serviceProviderAmount: number;
  platformFeeAmount: number;
  trustlessWorkAmount: number;
  setAmounts: (totalAmount: number, platformFee: number) => void;
}

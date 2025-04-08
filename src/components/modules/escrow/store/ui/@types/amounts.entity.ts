export interface AmountEscrowStore {
  serviceProviderAmount: number;
  platformFeeAmount: number;
  trustlessWorkAmount: number;
  serviceProviderResolve: string;
  approverResolve: string;
  amountMoonpay: string;
  setAmounts: (totalAmount: number, platformFee: number) => void;
  setServiceProviderResolve: (value: string) => void;
  setApproverResolve: (value: string) => void;
  setAmountMoonpay: (value: string) => void;
}

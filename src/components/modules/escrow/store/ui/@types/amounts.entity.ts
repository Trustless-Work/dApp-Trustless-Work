export interface AmountEscrowStore {
  receiverAmount: number;
  platformFeeAmount: number;
  trustlessWorkAmount: number;
  receiverResolve: string;
  approverResolve: string;
  amountMoonpay: string;
  setAmounts: (totalAmount: number, platformFee: number) => void;
  setReceiverResolve: (value: string) => void;
  setApproverResolve: (value: string) => void;
  setAmountMoonpay: (value: string) => void;
}

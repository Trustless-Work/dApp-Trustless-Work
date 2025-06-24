export interface AmountEscrowStore {
  receiverAmount: number;
  platformFeeAmount: number;
  trustlessWorkAmount: number;
  receiverResolve: number;
  approverResolve: number;
  amountMoonpay: number;
  setAmounts: (totalAmount: number, platformFee: number) => void;
  setReceiverResolve: (value: number) => void;
  setApproverResolve: (value: number) => void;
  setAmountMoonpay: (value: number) => void;
}

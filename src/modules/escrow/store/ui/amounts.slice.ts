import { StateCreator } from "zustand";

export type AmountEscrowStore = {
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
};

export const escrowAmountSlice: StateCreator<
  AmountEscrowStore,
  [["zustand/devtools", never]],
  [],
  AmountEscrowStore
> = (set) => {
  return {
    // Stores
    receiverAmount: 0,
    platformFeeAmount: 0,
    trustlessWorkAmount: 0,
    receiverResolve: 0,
    approverResolve: 0,
    amountMoonpay: 0,

    // Modifiers
    setAmounts: (totalAmount, platformFee) => {
      const trustlessPercentage = 0.3;
      const receiverPercentage = 100 - (trustlessPercentage + platformFee);

      set({
        receiverAmount: (totalAmount * receiverPercentage) / 100,
        platformFeeAmount: (totalAmount * platformFee) / 100,
        trustlessWorkAmount: (totalAmount * trustlessPercentage) / 100,
      });
    },

    setReceiverResolve: (value) => {
      set({ receiverResolve: value });
    },

    setApproverResolve: (value) => {
      set({ approverResolve: value });
    },

    setAmountMoonpay: (value) => {
      set({ amountMoonpay: value });
    },
  };
};

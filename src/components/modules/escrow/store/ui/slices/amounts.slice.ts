import { StateCreator } from "zustand";
import { AmountEscrowStore } from "../@types/amounts.entity";

export const useEscrowAmountSlice: StateCreator<
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
    receiverResolve: "",
    approverResolve: "",
    amountMoonpay: "",

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

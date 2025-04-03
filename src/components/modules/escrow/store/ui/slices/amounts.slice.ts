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
    serviceProviderAmount: 0,
    platformFeeAmount: 0,
    trustlessWorkAmount: 0,
    serviceProviderResolve: "",
    approverResolve: "",

    // Modifiers
    setAmounts: (totalAmount, platformFee) => {
      const trustlessPercentage = 0.3;
      const serviceProviderPercentage =
        100 - (trustlessPercentage + platformFee);

      set({
        serviceProviderAmount: (totalAmount * serviceProviderPercentage) / 100,
        platformFeeAmount: (totalAmount * platformFee) / 100,
        trustlessWorkAmount: (totalAmount * trustlessPercentage) / 100,
      });
    },

    setServiceProviderResolve: (value) => {
      set({ serviceProviderResolve: value });
    },

    setApproverResolve: (value) => {
      set({ approverResolve: value });
    },
  };
};

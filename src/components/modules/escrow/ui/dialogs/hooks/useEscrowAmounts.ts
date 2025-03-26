import { create } from "zustand";

interface EscrowAmountsState {
  serviceProvider: number;
  platformFee: number;
  trustlessWork: number;
  setAmounts: (totalAmount: number, platformFee: number) => void;
}

export const useEscrowAmounts = create<EscrowAmountsState>((set) => ({
  serviceProvider: 0,
  platformFee: 0,
  trustlessWork: 0,
  setAmounts: (totalAmount, platformFee) => {
    const trustlessPercentage = 0.3;
    const serviceProviderPercentage = 100 - (trustlessPercentage + platformFee);

    set({
      serviceProvider: (totalAmount * serviceProviderPercentage) / 100,
      platformFee: (totalAmount * platformFee) / 100,
      trustlessWork: (totalAmount * trustlessPercentage) / 100,
    });
  },
}));


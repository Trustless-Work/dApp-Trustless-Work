import { StateCreator } from "zustand";
import {
  EscrowFormData,
  InitializeFormEscrowStore,
} from "../@types/initialize-form.entity";

export const useEscrowInitializeFormSlice: StateCreator<
  InitializeFormEscrowStore,
  [["zustand/devtools", never]],
  [],
  InitializeFormEscrowStore
> = (set) => {
  const initialState: EscrowFormData = {
    approver: "",
    engagementId: "",
    serviceProvider: "",
    platformAddress: "",
    platformFee: "",
    amount: "",
    releaseSigner: "",
    disputeResolver: "",
    milestones: [{ description: "" }],
  };

  return {
    // Stores
    ...initialState,
    formData: initialState,

    // Modifiers
    setFormData: (data) =>
      set((state) => ({
        formData: {
          ...state.formData,
          ...data,
        },
      })),
    resetForm: () => set({ formData: initialState }),
  };
};

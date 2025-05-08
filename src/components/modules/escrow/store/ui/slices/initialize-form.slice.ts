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
    roles: {
      approver: "",
      serviceProvider: "",
      platformAddress: "",
      releaseSigner: "",
      disputeResolver: "",
    },
    engagementId: "",
    platformFee: "",
    amount: "",
    milestones: [{ description: "" }],
  };

  return {
    // Stores
    ...initialState,
    approver: initialState.roles.approver,
    serviceProvider: initialState.roles.serviceProvider,
    platformAddress: initialState.roles.platformAddress,
    releaseSigner: initialState.roles.releaseSigner,
    disputeResolver: initialState.roles.disputeResolver,
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

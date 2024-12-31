import { create } from "zustand";

interface Milestone {
  description: string;
}

interface EscrowFormData {
  client: string;
  engagementId: string;
  serviceProvider: string;
  platformAddress: string;
  platformFee: string;
  amount: string;
  releaseSigner: string;
  disputeResolver: string;
  milestones: Milestone[];
}

interface EscrowFormState {
  formData: EscrowFormData;
  setFormData: (data: Partial<EscrowFormData>) => void;
  resetForm: () => void;
}

const initialState: EscrowFormData = {
  client: "",
  engagementId: "",
  serviceProvider: "",
  platformAddress: "",
  platformFee: "",
  amount: "",
  releaseSigner: "",
  disputeResolver: "",
  milestones: [{ description: ""}],
};

export const useEscrowFormStore = create<EscrowFormState>((set) => ({
  formData: initialState,
  setFormData: (data) =>
    set((state) => ({
      formData: {
        ...state.formData,
        ...data,
      },
    })),
  resetForm: () => set({ formData: initialState }),
}));

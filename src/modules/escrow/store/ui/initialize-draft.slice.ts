import { StateCreator } from "zustand";

type EscrowTrustlineDraft = {
  address: string;
  symbol: string;
};

type BaseEscrowRolesDraft = {
  approver: string;
  serviceProvider: string;
  platformAddress: string;
  releaseSigner: string;
  disputeResolver: string;
};

type BaseInitializeEscrowDraft = {
  engagementId: string;
  title: string;
  description: string;
  platformFee?: string | number;
  trustline: EscrowTrustlineDraft;
};

export type InitializeSingleEscrowDraft = BaseInitializeEscrowDraft & {
  amount?: string | number;
  roles: BaseEscrowRolesDraft & {
    receiver: string;
  };
  milestones: {
    description: string;
  }[];
};

export type InitializeMultiEscrowDraft = BaseInitializeEscrowDraft & {
  roles: BaseEscrowRolesDraft;
  milestones: {
    description: string;
    receiver: string;
    amount?: string | number;
  }[];
};

export type InitializeDraftEscrowStore = {
  initializeSingleEscrowDraft: InitializeSingleEscrowDraft | null;
  initializeMultiEscrowDraft: InitializeMultiEscrowDraft | null;
  setInitializeSingleEscrowDraft: (
    draft: InitializeSingleEscrowDraft | null,
  ) => void;
  setInitializeMultiEscrowDraft: (
    draft: InitializeMultiEscrowDraft | null,
  ) => void;
  clearInitializeEscrowDrafts: () => void;
};

export const escrowInitializeDraftSlice: StateCreator<
  InitializeDraftEscrowStore,
  [["zustand/devtools", never]],
  [],
  InitializeDraftEscrowStore
> = (set) => ({
  initializeSingleEscrowDraft: null,
  initializeMultiEscrowDraft: null,
  setInitializeSingleEscrowDraft: (draft) =>
    set({ initializeSingleEscrowDraft: draft }),
  setInitializeMultiEscrowDraft: (draft) =>
    set({ initializeMultiEscrowDraft: draft }),
  clearInitializeEscrowDrafts: () =>
    set({
      initializeSingleEscrowDraft: null,
      initializeMultiEscrowDraft: null,
    }),
});

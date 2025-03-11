import { Escrow, Milestone } from "@/@types/escrow.entity";

export type EscrowFormData = Pick<
  Escrow,
  | "approver"
  | "engagementId"
  | "serviceProvider"
  | "platformAddress"
  | "platformFee"
  | "amount"
  | "releaseSigner"
  | "disputeResolver"
  | "milestones"
>;

export interface InitializeFormEscrowStore {
  approver: string;
  engagementId: string;
  serviceProvider: string;
  platformAddress: string;
  platformFee: string;
  amount: string;
  releaseSigner: string;
  disputeResolver: string;
  milestones: Milestone[];
  formData: EscrowFormData;
  setFormData: (data: Partial<EscrowFormData | null>) => void;
  resetForm: () => void;
}

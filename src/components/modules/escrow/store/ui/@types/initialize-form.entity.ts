import { Escrow, Milestone } from "@/@types/escrows/escrow.entity";

export type EscrowFormData = {
  roles: Pick<
    Escrow["roles"],
    | "approver"
    | "serviceProvider"
    | "platformAddress"
    | "releaseSigner"
    | "disputeResolver"
  >;
} & Pick<Escrow, "engagementId" | "platformFee" | "amount" | "milestones">;

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

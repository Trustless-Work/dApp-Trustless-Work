"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  changeMilestoneStatusSchema,
  createManageMilestonesSchema,
  fundEscrowSchema,
  resolveDisputeSchema,
  startDisputeSchema,
  updateEscrowSchema,
  withdrawFundsSchema,
  type ChangeMilestoneStatusFormData,
  type FundEscrowFormData,
  type FundEscrowFormInput,
  type ManageMilestonesFormData,
  type ResolveDisputeFormData,
  type ResolveDisputeFormInput,
  type StartDisputeFormData,
  type UpdateEscrowFormData,
  type WithdrawFundsFormData,
  type WithdrawFundsFormInput,
} from "@/features/escrows/schemas/escrow-action.schemas";
import type { ManageMilestonesDefaultValues } from "@/features/escrows/utils/manage-milestones.helper";

export function useFundEscrowForm() {
  return useForm<FundEscrowFormInput, unknown, FundEscrowFormData>({
    resolver: zodResolver(fundEscrowSchema),
    defaultValues: { amount: "" },
    mode: "onChange",
  });
}

export function useWithdrawFundsForm(defaultAddress = "") {
  return useForm<WithdrawFundsFormInput, unknown, WithdrawFundsFormData>({
    resolver: zodResolver(withdrawFundsSchema),
    defaultValues: {
      address: defaultAddress,
      amount: "",
    },
    mode: "onChange",
  });
}

export function useUpdateEscrowForm(defaults: {
  title: string;
  description: string;
}) {
  return useForm<UpdateEscrowFormData>({
    resolver: zodResolver(updateEscrowSchema),
    defaultValues: defaults,
    mode: "onChange",
  });
}

export function useStartDisputeForm() {
  return useForm<StartDisputeFormData>({
    resolver: zodResolver(startDisputeSchema),
    defaultValues: { reason: "" },
    mode: "onChange",
  });
}

export function useChangeMilestoneStatusForm(defaultStatus = "") {
  return useForm<ChangeMilestoneStatusFormData>({
    resolver: zodResolver(changeMilestoneStatusSchema),
    defaultValues: { newStatus: defaultStatus, newEvidence: "" },
    mode: "onChange",
  });
}

export function useResolveDisputeForm(
  defaultRows: ResolveDisputeFormInput["rows"] = [{ address: "", amount: "" }],
) {
  return useForm<ResolveDisputeFormInput, unknown, ResolveDisputeFormData>({
    resolver: zodResolver(resolveDisputeSchema),
    defaultValues: { rows: defaultRows },
    mode: "onChange",
  });
}

export function useManageMilestonesForm(params: {
  isMulti: boolean;
  approversCount: number;
  defaultValues: ManageMilestonesDefaultValues;
}) {
  return useForm<ManageMilestonesFormData>({
    resolver: zodResolver(
      createManageMilestonesSchema({
        isMulti: params.isMulti,
        approversCount: params.approversCount,
      }),
    ),
    defaultValues: params.defaultValues,
    mode: "onChange",
  });
}

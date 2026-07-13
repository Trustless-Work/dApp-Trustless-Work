"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  changeMilestoneStatusSchema,
  fundEscrowSchema,
  resolveDisputeSchema,
  startDisputeSchema,
  updateEscrowSchema,
  withdrawFundsSchema,
  type ChangeMilestoneStatusFormData,
  type FundEscrowFormData,
  type FundEscrowFormInput,
  type ResolveDisputeFormData,
  type ResolveDisputeFormInput,
  type StartDisputeFormData,
  type UpdateEscrowFormData,
  type WithdrawFundsFormData,
  type WithdrawFundsFormInput,
} from "@/features/escrows/schemas/escrow-action.schemas";

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
    defaultValues: { newStatus: defaultStatus },
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

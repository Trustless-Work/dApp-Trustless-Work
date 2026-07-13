import { z } from "zod/v3";
import { isStellarPublicKey } from "@/helpers/stellar.helper";

const amountFromInputSchema = z
  .string()
  .trim()
  .min(1, "Amount is required")
  .refine(
    (value) => Number.isFinite(Number(value)) && Number(value) > 0,
    "Amount must be greater than 0",
  )
  .transform((value) => Number(value));

const stellarAddressSchema = z
  .string()
  .trim()
  .min(1, "Address is required")
  .refine(isStellarPublicKey, "Enter a valid Stellar public key");

export const fundEscrowSchema = z.object({
  amount: amountFromInputSchema,
});

export type FundEscrowFormInput = z.input<typeof fundEscrowSchema>;
export type FundEscrowFormData = z.output<typeof fundEscrowSchema>;

export const withdrawFundsSchema = z.object({
  address: stellarAddressSchema,
  amount: amountFromInputSchema,
});

export type WithdrawFundsFormInput = z.input<typeof withdrawFundsSchema>;
export type WithdrawFundsFormData = z.output<typeof withdrawFundsSchema>;

export const updateEscrowSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  description: z.string().trim().min(1, "Description is required").max(2000),
});

export type UpdateEscrowFormData = z.infer<typeof updateEscrowSchema>;

export const startDisputeSchema = z.object({
  reason: z.string().trim().min(1, "Reason is required").max(1000),
});

export type StartDisputeFormData = z.infer<typeof startDisputeSchema>;

export const changeMilestoneStatusSchema = z.object({
  newStatus: z.string().trim().min(1, "Status is required").max(100),
});

export type ChangeMilestoneStatusFormData = z.infer<
  typeof changeMilestoneStatusSchema
>;

export const resolveDisputeDistributionSchema = z.object({
  address: stellarAddressSchema,
  amount: amountFromInputSchema,
});

export const resolveDisputeSchema = z.object({
  rows: z
    .array(resolveDisputeDistributionSchema)
    .min(1, "Add at least one distribution"),
});

export type ResolveDisputeFormInput = z.input<typeof resolveDisputeSchema>;
export type ResolveDisputeFormData = z.output<typeof resolveDisputeSchema>;

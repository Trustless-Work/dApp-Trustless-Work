import { z } from "zod";

export const formSchema = z.object({
  client: z.string().min(1, {
    message: "Client is required.",
  }),
  engagementId: z.string().min(1, {
    message: "Engagement is required.",
  }),
  title: z.string().min(1, {
    message: "Title is required.",
  }),
  description: z.string().min(1, {
    message: "Description is required.",
  }),
  serviceProvider: z.string().min(1, {
    message: "Service provider is required.",
  }),
  platformAddress: z.string().min(1, {
    message: "Platform address is required.",
  }),
  platformFee: z.string().min(1, {
    message: "Platform fee is required.",
  }),
  amount: z.string().min(1, {
    message: "Amount must be greater than 0.",
  }),
  releaseSigner: z.string().min(1, {
    message: "Release signer is required.",
  }),
  disputeResolver: z.string().min(1, {
    message: "Dispute resolver is required.",
  }),
  milestones: z
    .array(
      z.object({
        description: z.string().min(1, {
          message: "Milestone description is required.",
        }),
      }),
    )
    .min(1, { message: "At least one milestone is required." }),
});

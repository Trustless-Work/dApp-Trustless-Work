import { Escrow } from "@/@types/escrow.entity";
import { z } from "zod";

export const getFormSchema = (selectedEscrow: Escrow | null) => {
  return z.object({
    approverFunds: z
      .string()
      .min(1, {
        message: "Approver funds is required.",
      })
      .refine((value) => !isNaN(Number(value)) && Number(value) > 0, {
        message: "Approver funds must be a valid number.",
      })
      .refine(
        (value) => {
          const approverFunds = parseFloat(value);

          return (
            selectedEscrow !== null &&
            approverFunds < Number(selectedEscrow.balance)
          );
        },
        {
          message: "Approvers funds cannot exceed the balance.",
        },
      )
      .refine(
        (value) => {
          const approverFunds = parseFloat(value);

          return (
            selectedEscrow !== null &&
            approverFunds < Number(selectedEscrow.amount)
          );
        },
        {
          message: "Approvers funds cannot exceed the amount.",
        },
      ),
    serviceProviderFunds: z
      .string()
      .min(1, {
        message: "Service Provider funds is required.",
      })
      .refine((value) => !isNaN(Number(value)) && Number(value) > 0, {
        message: "Service Provider funds must be a valid number.",
      })
      .refine(
        (value) => {
          const serviceProviderFunds = parseFloat(value);
          return (
            selectedEscrow !== null &&
            serviceProviderFunds < Number(selectedEscrow.balance)
          );
        },
        {
          message: "Service Provider funds cannot exceed the balance.",
        },
      )
      .refine(
        (value) => {
          const serviceProviderFunds = parseFloat(value);
          return (
            selectedEscrow !== null &&
            serviceProviderFunds < Number(selectedEscrow.amount)
          );
        },
        {
          message: "Service Provider funds cannot exceed the amount.",
        },
      ),
  });
};

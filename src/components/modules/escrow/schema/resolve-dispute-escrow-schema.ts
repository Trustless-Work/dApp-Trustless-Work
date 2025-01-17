import { Escrow } from "@/@types/escrow.entity";
import { z } from "zod";

export const getFormSchema = (selectedEscrow: Escrow | null) => {
  return z.object({
    clientFunds: z
      .string()
      .min(1, {
        message: "Client funds is required.",
      })
      .refine((value) => !isNaN(Number(value)) && Number(value) > 0, {
        message: "Client funds must be a valid number.",
      })
      .refine(
        (value) => {
          const clientFunds = parseFloat(value);

          return (
            selectedEscrow !== null &&
            clientFunds < Number(selectedEscrow.balance)
          );
        },
        {
          message: "Clients funds cannot exceed the balance.",
        },
      )
      .refine(
        (value) => {
          const clientFunds = parseFloat(value);

          return (
            selectedEscrow !== null &&
            clientFunds < Number(selectedEscrow.amount)
          );
        },
        {
          message: "Clients funds cannot exceed the amount.",
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

import { z } from "zod";
import { WalletType } from "@/@types/contact.entity";

export const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  address: z.string().min(1, "Wallet address is required"),
  walletType: z.nativeEnum(WalletType),
});

export type ContactFormData = z.infer<typeof formSchema>;

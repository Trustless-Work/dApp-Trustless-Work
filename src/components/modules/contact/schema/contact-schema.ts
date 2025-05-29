import { z } from "zod";
import { WalletType } from "@/@types/contact.entity";
import { useValidData } from "@/utils/hook/valid-data.hook";

export const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  address: z
    .string()
    .min(1, "Wallet address is required")
    .refine(
      (value) => {
        const { isValidWallet } = useValidData();
        return isValidWallet(value);
      },
      {
        message: "Must be a valid Stellar wallet address",
      },
    ),
  walletType: z.nativeEnum(WalletType),
});

export type ContactFormData = z.infer<typeof formSchema>;

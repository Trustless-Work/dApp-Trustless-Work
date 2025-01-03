import { z } from "zod";

export enum WalletType {
  Albedo = "Albedo",
  LOBSTR = "LOBSTR",
}

export const formSchema = z.object({
  name: z.string().min(3, {
    message: "Name must be at least 3 characters.",
  }),
  lastName: z.string().min(3, {
    message: "Last name must be at least 3 characters.",
  }),
  email: z.string().email({ message: "Invalid email address" }),
  type: z.nativeEnum(WalletType),
  address: z.string().min(10, {
    message: "Address must be at least 10 characters.",
  }),
});

import { z } from "zod";

export enum RequestType {
  Individual = "Individual",
  Company = "Company",
}

export const formSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .refine(
      (email) => /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(email), // Custom regex for additional validation
      { message: "Invalid email domain." },
    ),
  type: z.nativeEnum(RequestType),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters" }),
});

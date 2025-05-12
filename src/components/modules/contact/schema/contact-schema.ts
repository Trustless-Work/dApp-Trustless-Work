import { z } from "zod";
import { RoleType } from "@/@types/contact.entity";

export const contactSchema = z.object({
  firstName: z.string().min(3, {
    message: "First name must be at least 3 characters.",
  }),
  lastName: z.string().min(3, {
    message: "Last name must be at least 3 characters.",
  }),
  email: z.string().email({ message: "Invalid email address" }),
  address: z.string().min(10, {
    message: "Address must be at least 10 characters.",
  }),
  role: z.nativeEnum(RoleType, {
    required_error: "Role is required",
  }),
});

export type ContactFormData = z.infer<typeof contactSchema>;

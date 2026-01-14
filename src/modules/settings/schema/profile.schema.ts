import { z } from "zod";
import { Country } from "@/constants/countries.enum";

const formSchema = z.object({
  identification: z.string().optional(),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email format").min(1, "Email is required"),
  phone: z
    .string()
    .regex(/^\+?[0-9]{7,15}$/, "Invalid phone number format")
    .min(1, "Phone is required"),
  // Stored as a human-readable country name (enum values) or empty.
  country: z.union([z.nativeEnum(Country), z.literal("")]).optional(),
  useCase: z.string().min(1, "Use case is required"),
  profileImage: z
    .union([z.string().url("Profile image must be a valid URL"), z.literal("")])
    .optional(),
});

export default formSchema;

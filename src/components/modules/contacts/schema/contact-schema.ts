import { z } from "zod";

export const GetContactFormSchema = () => {
  return z.object({
    name: z.string().min(3, {
      message: "Name must be at least 3 characters.",
    }),
    lastName: z.string().min(3, {
      message: "Last name must be at least 3 characters.",
    }),
    email: z.string().email({
      message: "Invalid email address.",
    }),
    address: z.string().min(10, {
      message: "Address must be at least 10 characters.",
    }),
    category: z
      .array(z.enum(["favorites", "personal"]))
      .min(1, { message: "At least one category must be selected." }),
  });
};

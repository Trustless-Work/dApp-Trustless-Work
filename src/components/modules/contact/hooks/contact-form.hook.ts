import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore/lite";
import { firebaseDB } from "../../../../../firebase";

const formSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .refine(
      (email) => /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(email), // Custom regex for additional validation
      { message: "Invalid email domain." },
    ),
  type: z.enum(["company", "individual"], {
    required_error: "Please select a type",
  }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters" }),
});

type FormValues = z.infer<typeof formSchema>;

export const useContactForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      type: undefined,
      description: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      // Mock API call for email uniqueness check and Firebase insertion
      const { firstName: name, lastName, email, type, description } = data;

      const q = query(
        collection(firebaseDB, "api keys"),
        where("email", "==", email),
      );

      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        console.log("Email already exists!");
        toast({
          title: "Error",
          description: "An API key has already been requested with this email.",
          variant: "destructive",
        });
        return; // If it already exists, do not add the new record.
      }

      //  If it doesn't exist, add the new record
      await addDoc(collection(firebaseDB, "api keys"), {
        name,
        lastName,
        email,
        type,
        description,
        createdAt: new Date().toISOString(),
      });
      console.log("Document successfully added!");
      toast({
        title: "Success",
        description: "Your API key request has been submitted successfully.",
      });
      form.reset();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "An error occurred while processing your request.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { form, isLoading, onSubmit };
};

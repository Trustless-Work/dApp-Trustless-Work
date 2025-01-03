/* eslint-disable @typescript-eslint/no-explicit-any */
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  arrayUnion,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/core/config/firebase/firebase";
import { formSchema } from "../schema/contact-schema";

export const useContact = () => {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      lastName: "",
      email: "",
      address: "",
    },
  });

  const onSubmit = async (payload: z.infer<typeof formSchema>) => {
    try {
      const userId = "USER_ID";
      const userRef = doc(db, "users", userId);

      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        await updateDoc(userRef, {
          contacts: arrayUnion(payload),
          updatedAt: serverTimestamp(),
        });
      } else {
        await setDoc(userRef, {
          contacts: [payload],
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }

      form.reset();
      toast({
        title: "Success",
        description: "Contact saved successfully",
      });
    } catch (error: any) {
      const errorMessage =
        error.response && error.response.data
          ? error.response.data.message
          : "An error occurred";

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return { form, onSubmit };
};

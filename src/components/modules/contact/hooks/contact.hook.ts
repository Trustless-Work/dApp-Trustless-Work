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
import { db } from "@/core/config/firebase/firebase";
import { formSchema, WalletType } from "../schema/contact-schema";
import { toast } from "sonner";

export const useContact = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      lastName: "",
      email: "",
      address: "",
    },
    mode: "onChange",
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
      toast.success("Contact saved successfully");
    } catch (error: any) {
      const errorMessage =
        error.response && error.response.data
          ? error.response.data.message
          : "An error occurred";

      toast.error(errorMessage);
    }
  };

  const typeOptions = Object.values(WalletType).map((value) => ({
    value,
    label: value,
  }));

  return { form, onSubmit, typeOptions };
};

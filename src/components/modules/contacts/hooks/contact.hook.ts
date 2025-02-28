/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

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
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/toast.hook";
import { db } from "@/core/config/firebase/firebase";
import { formSchema, WalletType } from "../schema/contact-schema";
import { useGlobalAuthenticationStore } from "@/core/store/data";

export const useMyContact = () => {
  const [isLoading, setIsLoading] = useState(false);

  const { address } = useGlobalAuthenticationStore();
  const router = useRouter();

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
    setIsLoading(true);

    try {
      const userId = address || "USER_ID";
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
      router.push("/dashboard/contacts");

      toast({
        title: "Success",
        description: "Contact saved successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFieldChange = (name: string, value: any) => {
    form.setValue(name as any, value);
  };

  const typeOptions = useMemo(() => {
    return Object.values(WalletType).map((value) => ({
      value,
      label: value,
    }));
  }, []);

  return {
    form,
    onSubmit,
    handleFieldChange,
    typeOptions,
    isLoading,
  };
};

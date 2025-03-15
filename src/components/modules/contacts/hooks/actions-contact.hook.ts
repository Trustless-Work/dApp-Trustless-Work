"use client";

import { toast } from "@/hooks/toast.hook";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useContactBoundedStore } from "../store/ui";
import { GetContactFormSchema } from "../schema/contact-schema";
import { useGlobalUIBoundedStore } from "@/core/store/ui";
import { useGlobalBoundedStore } from "@/core/store/data";

export const useCreateContact = () => {
  const [showSelect] = useState({
    additionalField: false,
  });

  const formData = useContactBoundedStore((state) => state.formData);
  const setFormData = useContactBoundedStore((state) => state.setFormData);
  const resetForm = useContactBoundedStore((state) => state.resetForm);
  const setIsSuccessDialogOpen = useContactBoundedStore(
    (state) => state.setIsSuccessDialogOpen,
  );

  const isCreatingContact = useContactBoundedStore(
    (state) => state.isCreatingContact,
  );

  const addContact = useGlobalBoundedStore((state) => state.addContact);
  const toggleContactStatus = useGlobalBoundedStore(
    (state) => state.toggleContactStatus,
  );

  const setIsCreatingContact = useContactBoundedStore(
    (state) => state.setIsCreatingContact,
  );
  const setIsLoading = useGlobalUIBoundedStore((state) => state.setIsLoading);

  const router = useRouter();
  const formSchema = GetContactFormSchema();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      lastName: "",
      email: "",
      address: "",
      category: ["personal"],
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (formData) {
      Object.entries(formData).forEach(([key, value]) => {
        form.setValue(key as keyof z.infer<typeof formSchema>, value as any);
      });
    }
  }, [formData, form.setValue]);

  const onSubmit = async (payload: z.infer<typeof formSchema>) => {
    const contactPayload = {
      ...payload,
      status: true,
    };

    setFormData(contactPayload);
    setIsCreatingContact(true);
    setIsLoading(true);
    setIsSuccessDialogOpen(false);

    try {
      const data = await addContact(contactPayload);

      if (data) {
        setIsSuccessDialogOpen(true);
        toast({
          title: "Success",
          description: "Contact added successfully.",
        });

        resetForm();
        form.reset();

        router.push("/dashboard/contacts");
      } else {
        setIsSuccessDialogOpen(false);
        toast({
          title: "Error",
          description: "An error occurred while adding the contact.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      setIsSuccessDialogOpen(false);
      toast({
        title: "Error",
        description: error.message || "Unexpected error",
        variant: "destructive",
      });
    } finally {
      setIsCreatingContact(false);
      setIsLoading(false);
    }
  };

  const handleToggleStatus = async (contactId: string) => {
    setIsLoading(true);

    try {
      await toggleContactStatus(contactId);
      toast({
        title: "Success",
        description: "Contact status toggled successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to toggle contact status.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    onSubmit,
    handleToggleStatus,
    showSelect,
    isCreatingContact,
  };
};

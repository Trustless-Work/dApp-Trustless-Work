"use client";

import { toast } from "@/hooks/toast.hook";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useMemo, useState } from "react";
import { useGlobalAuthenticationStore } from "@/core/store/data";
import { contactSchema, ContactFormData } from "../schema/contact-schema";
import { Contact, RoleType } from "@/@types/contact.entity";
import {
  getContacts,
  createContact,
  deleteContact,
} from "../server/contact.firebase";
import { Timestamp } from "firebase/firestore";

export const useContact = () => {
  const { address } = useGlobalAuthenticationStore();
  const [isLoading, setIsLoading] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      address: "",
      role: RoleType.BUYER,
    },
    mode: "onChange",
  });

  const fetchContacts = async () => {
    if (!address) return;
    try {
      setIsLoading(true);
      const fetchedContacts = await getContacts(address);
      setContacts(fetchedContacts);
    } catch (error: unknown) {
      console.error("[Contact] Error fetching contacts:", error);
      toast({
        title: "Error fetching contacts",
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: ContactFormData) => {
    if (!address) return;
    try {
      setIsSubmitting(true);
      const now = Timestamp.now();
      const contact: Contact = {
        id: crypto.randomUUID(),
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        address: data.address,
        role: data.role,
        createdAt: now,
        updatedAt: now,
      };
      await createContact(address, contact);
      toast({
        title: "Success",
        description: "Contact created successfully",
      });
      form.reset();
      fetchContacts();
    } catch (error: unknown) {
      console.error("[Contact] Error creating contact:", error);
      toast({
        title: "Error creating contact",
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteContact = async (contactId: string) => {
    if (!address) return;
    try {
      setIsDeleting(true);
      await deleteContact(address, contactId);
      toast({
        title: "Success",
        description: "Contact deleted successfully",
      });
      fetchContacts();
    } catch (error: unknown) {
      console.error("[Contact] Error deleting contact:", error);
      toast({
        title: "Error deleting contact",
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [address]);

  const roleOptions = useMemo(() => {
    return Object.values(RoleType).map((role) => ({
      value: role,
      label: role.charAt(0) + role.slice(1).toLowerCase().replace("_", " "),
    }));
  }, []);

  return {
    form,
    contacts,
    isLoading,
    isSubmitting,
    isDeleting,
    onSubmit,
    handleDeleteContact,
    roleOptions,
  };
};

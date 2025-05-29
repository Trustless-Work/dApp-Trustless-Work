import { useState } from "react";
import { Contact } from "@/@types/contact.entity";
import { ContactFormData } from "@/components/modules/contact/schema/contact-schema";
import { useGlobalAuthenticationStore } from "@/core/store/data";
import { useContactUIBoundedStore } from "@/components/modules/contact/store/ui";
import { useGlobalUIBoundedStore } from "@/core/store/ui";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useContactsQuery } from "./tanstack/useContactsQuery";
import { useCreateContactMutation } from "./tanstack/useCreateContactMutation";
import { useDeleteContactMutation } from "./tanstack/useDeleteContactMutation";

interface UseContactHook {
  contacts: Contact[];
  isLoading: boolean;
  isSubmitting: boolean;
  isDeleting: boolean;
  activeMode: "table" | "cards";
  setActiveMode: (mode: "table" | "cards") => void;
  handleCreateContact: (data: ContactFormData) => Promise<void>;
  handleDeleteContact: (id: string) => Promise<void>;
  run: boolean;
  setRun: (run: boolean) => void;
  steps: {
    target: string;
    content: string;
    disableBeacon: boolean;
  }[];
  theme: string;
}

export const useContact = (): UseContactHook => {
  const { address } = useGlobalAuthenticationStore();
  const [run, setRun] = useState(false);
  const { activeMode, setActiveMode } = useContactUIBoundedStore();
  const { theme } = useGlobalUIBoundedStore();
  const router = useRouter();

  // Queries
  const { data: contacts = [], isLoading } = useContactsQuery();

  // Mutations
  const createMutation = useCreateContactMutation();
  const deleteMutation = useDeleteContactMutation();

  const steps = [
    {
      target: "#step-1",
      content: "View your contacts in table or card format",
      disableBeacon: true,
    },
    {
      target: "#step-2",
      content: "Create a new contact",
      disableBeacon: true,
    },
  ];

  const handleCreateContact = async (data: ContactFormData) => {
    if (!address) return;
    try {
      await createMutation.mutateAsync(data);
      toast.success("Contact created successfully");
      router.push("/dashboard/contact");
    } catch (error) {
      console.error("[Contact] Error creating contact:", error);
      toast.error("Error creating contact", {
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    }
  };

  const handleDeleteContact = async (id: string) => {
    if (!address) return;
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Contact deleted successfully");
    } catch (error) {
      console.error("[Contact] Error deleting contact:", error);
      toast.error("Error deleting contact", {
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    }
  };

  return {
    contacts,
    isLoading,
    isSubmitting: createMutation.isPending,
    isDeleting: deleteMutation.isPending,
    activeMode,
    setActiveMode,
    handleCreateContact,
    handleDeleteContact,
    run,
    setRun,
    steps,
    theme,
  };
};

import { useState, useEffect, useMemo } from "react";
import { Contact, RoleType } from "@/@types/contact.entity";
import {
  getContacts,
  createContact,
  deleteContact,
} from "@/components/modules/contact/server/contact.firebase";
import { useGlobalAuthenticationStore } from "@/core/store/data";
import { toast } from "sonner";

interface UseContactHook {
  contacts: Contact[];
  isLoading: boolean;
  isSubmitting: boolean;
  isDeleting: boolean;
  handleCreateContact: (contact: Contact) => Promise<void>;
  handleDeleteContact: (id: string) => Promise<void>;
  roleOptions: { value: string; label: string }[];
}

export const useContact = (type?: string): UseContactHook => {
  const { address } = useGlobalAuthenticationStore();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchContacts = async () => {
    if (!address) return;
    try {
      setIsLoading(true);
      const fetchedContacts = await getContacts(address);
      const filteredContacts = type
        ? fetchedContacts.filter(
            (contact) => contact.role.toLowerCase() === type.toLowerCase(),
          )
        : fetchedContacts;
      setContacts(filteredContacts);
    } catch (error) {
      console.error("[Contact] Error fetching contacts:", error);
      toast.error("Error fetching contacts", {
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateContact = async (contact: Contact) => {
    if (!address) return;
    try {
      setIsSubmitting(true);
      await createContact(address, contact);
      toast.success("Contact created successfully");
      fetchContacts();
    } catch (error) {
      console.error("[Contact] Error creating contact:", error);
      toast.error("Error creating contact", {
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteContact = async (id: string) => {
    if (!address) return;
    try {
      setIsDeleting(true);
      await deleteContact(address, id);
      toast.success("Contact deleted successfully");
      fetchContacts();
    } catch (error) {
      console.error("[Contact] Error deleting contact:", error);
      toast.error("Error deleting contact", {
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [address, type]);

  const roleOptions = useMemo(() => {
    return Object.values(RoleType).map((role) => ({
      value: role,
      label: role.charAt(0) + role.slice(1).toLowerCase().replace("_", " "),
    }));
  }, []);

  return {
    contacts,
    isLoading,
    isSubmitting,
    isDeleting,
    handleCreateContact,
    handleDeleteContact,
    roleOptions,
  };
};

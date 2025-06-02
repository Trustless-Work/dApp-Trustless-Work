import { useEffect, useMemo, useState } from "react";
import { ContactFormData } from "@/components/modules/contact/schema/contact-schema";
import { useGlobalAuthenticationStore } from "@/core/store/data";
import { useContactUIBoundedStore } from "@/components/modules/contact/store/ui";
import { toast } from "sonner";
import { usePathname, useRouter } from "next/navigation";
import { useContactsQuery } from "./tanstack/useContactsQuery";
import { useCreateContactMutation } from "./tanstack/useCreateContactMutation";
import { useDeleteContactMutation } from "./tanstack/useDeleteContactMutation";
import { useUpdateContactMutation } from "./tanstack/useUpdateContactMutation";
import { useUsersQuery } from "./tanstack/useUsersQuery";

export const useContact = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);

  const { address } = useGlobalAuthenticationStore();
  const { activeMode, setActiveMode } = useContactUIBoundedStore();
  const { filters, setFilters } = useContactUIBoundedStore();
  const router = useRouter();
  const pathname = usePathname();

  // Queries
  const { data: contacts = [], isLoading: isLoadingContacts } =
    useContactsQuery();
  const { data: users = [], isLoading: isLoadingUsers } = useUsersQuery();

  // Mutations
  const createMutation = useCreateContactMutation();
  const deleteMutation = useDeleteContactMutation();
  const updateMutation = useUpdateContactMutation();

  // Update URL params
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.name) params.set("name", filters.name);
    if (filters.email) params.set("email", filters.email);
    if (filters.walletType) params.set("walletType", filters.walletType);
    params.set("page", currentPage.toString());
    params.set("perPage", itemsPerPage.toString());

    const queryString = params.toString();
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
    router.push(newUrl);
  }, [filters, pathname, router, currentPage, itemsPerPage]);

  const filteredContacts = useMemo(() => {
    return contacts.filter((contact) => {
      const matchesName =
        filters.name === "" ||
        contact.name.toLowerCase().includes(filters.name.toLowerCase());
      const matchesEmail =
        filters.email === "" ||
        contact.email.toLowerCase().includes(filters.email.toLowerCase());
      const matchesWalletType =
        !filters.walletType || contact.walletType === filters.walletType;

      return matchesName && matchesEmail && matchesWalletType;
    });
  }, [contacts, filters]);

  const totalPages = Math.ceil(filteredContacts.length / itemsPerPage);

  const paginatedContacts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredContacts.slice(startIndex, endIndex);
  }, [filteredContacts, currentPage, itemsPerPage]);

  const handleClearFilters = () => {
    setFilters({
      name: "",
      email: "",
      walletType: null,
    });
    setCurrentPage(1);
    router.push(pathname);
  };

  const handleSubmit = async (data: ContactFormData) => {
    await handleCreateContact(data);
    setIsSheetOpen(false);
  };

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

  const handleUpdateContact = async (
    id: string,
    data: ContactFormData,
  ): Promise<boolean> => {
    if (!address) return false;
    try {
      await updateMutation.mutateAsync({ id, data });
      toast.success("Contact updated successfully");
      router.refresh();
      return true;
    } catch (error) {
      console.error("[Contact] Error updating contact:", error);
      toast.error("Error updating contact", {
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
      return false;
    }
  };

  const itemsPerPageOptions = [
    { value: 5, label: "5" },
    { value: 10, label: "10" },
    { value: 15, label: "15" },
    { value: 25, label: "25" },
    { value: 50, label: "50" },
  ];

  return {
    contacts: paginatedContacts,
    users,
    isLoading: isLoadingContacts || isLoadingUsers,
    isSubmitting: createMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isUpdating: updateMutation.isPending,
    activeMode,
    setActiveMode,
    handleCreateContact,
    handleDeleteContact,
    handleUpdateContact,
    isSheetOpen,
    setIsSheetOpen,
    handleClearFilters,
    handleSubmit,
    filteredContacts,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    totalPages,
    itemsPerPageOptions,
  };
};

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteContact } from "../../server/contact.firebase";
import { useGlobalAuthenticationStore } from "@/store/data";

export const useDeleteContactMutation = () => {
  const queryClient = useQueryClient();
  const address = useGlobalAuthenticationStore((state) => state.address);

  return useMutation({
    mutationFn: (contactId: string) => deleteContact(address, contactId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts", address] });
    },
    onError: (error) => {
      console.error("[Contact] Error deleting contact:", error);
    },
  });
};

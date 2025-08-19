import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateContact } from "../../server/contact.firebase";
import { ContactFormData } from "../../schema/contact-schema";
import { useGlobalAuthenticationStore } from "@/store/data";
import { Contact } from "@/types/contact.entity";

export const useUpdateContactMutation = () => {
  const queryClient = useQueryClient();
  const address = useGlobalAuthenticationStore((state) => state.address);

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ContactFormData }) =>
      updateContact(address, id, data as Partial<Contact>),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts", address] });
    },
  });
};

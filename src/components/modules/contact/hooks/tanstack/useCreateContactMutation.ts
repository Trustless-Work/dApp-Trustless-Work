import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createContact } from "../../server/contact.firebase";
import { ContactFormData } from "../../schema/contact-schema";
import { useGlobalAuthenticationStore } from "@/core/store/data";
import { Contact } from "@/@types/contact.entity";

export const useCreateContactMutation = () => {
  const queryClient = useQueryClient();
  const address = useGlobalAuthenticationStore((state) => state.address);

  return useMutation({
    mutationFn: (data: ContactFormData) =>
      createContact(address, data as Contact),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts", address] });
    },
  });
};

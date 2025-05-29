import { useQuery } from "@tanstack/react-query";
import { getContacts } from "../../server/contact.firebase";
import { useGlobalAuthenticationStore } from "@/core/store/data";

export const useContactsQuery = () => {
  const address = useGlobalAuthenticationStore((state) => state.address);

  return useQuery({
    queryKey: ["contacts", address],
    queryFn: () => getContacts(address),
    enabled: !!address,
    staleTime: 1000 * 60 * 5, // 5 min
  });
};

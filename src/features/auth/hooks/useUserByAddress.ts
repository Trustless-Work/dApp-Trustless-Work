import { useQuery } from "@tanstack/react-query";
import { AuthService } from "@/modules/auth/services/auth.service";
import type { User } from "@/types/user.entity";

export function useUserByAddress(address?: string | null) {
  return useQuery<User | null, Error, User | null>({
    queryKey: ["user", address],
    queryFn: async () => {
      if (!address) return null;
      return await new AuthService().getUser(address);
    },
    enabled: !!address,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
    placeholderData: (prev) => prev ?? null,
  });
}

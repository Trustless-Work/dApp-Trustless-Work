import { AuthService } from "@/components/modules/auth/services/auth.service";
import { useQuery } from "@tanstack/react-query";

export const useUsersQuery = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const data = await new AuthService().getAllUsers();
      if (!data) throw new Error("Failed to fetch users");

      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

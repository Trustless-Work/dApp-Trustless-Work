import { useQuery } from "@tanstack/react-query";
import { AuthService } from "@/modules/auth/services/auth.service";

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

import { useQuery } from "@tanstack/react-query";
import { getAllUsers } from "@/components/modules/auth/server/authentication.firebase";

export const useUsersQuery = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { success, data } = await getAllUsers();
      if (!success) throw new Error("Failed to fetch users");
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

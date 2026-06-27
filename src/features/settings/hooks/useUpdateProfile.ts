"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { profileService } from "@/features/settings/services/profile.service";
import type { UpdateProfileInput } from "@/features/settings/schemas/profile.schema";
import { parseApiError } from "@/lib/api-error";

type UseUpdateProfileOptions = {
  onSuccess?: () => void;
};

export function useUpdateProfile(options?: UseUpdateProfileOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateProfileInput) =>
      profileService.updateProfile(payload),
    onSuccess: (user) => {
      queryClient.setQueryData(["session", "me"], user);
      void queryClient.invalidateQueries({ queryKey: ["session", "me"] });
      toast.success("Profile updated", {
        description: "Your profile details were saved successfully.",
      });
      options?.onSuccess?.();
    },
    onError: (error) => {
      toast.error(parseApiError(error).detail);
    },
  });
}

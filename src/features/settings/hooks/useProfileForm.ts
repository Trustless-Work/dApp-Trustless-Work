"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { UserResponse } from "@/types";
import {
  profileSchema,
  type ProfileFormData,
  type UpdateProfileInput,
} from "@/features/settings/schemas/profile.schema";
import { useUpdateProfile } from "@/features/settings/hooks/useUpdateProfile";

function mapUserToFormValues(user: UserResponse): ProfileFormData {
  return {
    firstName: user.firstName?.trim() ?? "",
    lastName: user.lastName?.trim() ?? "",
    email: user.email?.trim() ?? "",
  };
}

function mapFormToPayload(values: ProfileFormData): UpdateProfileInput {
  return {
    firstName: values.firstName.trim(),
    lastName: values.lastName.trim() || undefined,
    email: values.email.trim() || undefined,
  };
}

type UseProfileFormOptions = {
  user: UserResponse;
  onSaved?: () => void;
};

export function useProfileForm({ user, onSaved }: UseProfileFormOptions) {
  const { mutateAsync, isPending } = useUpdateProfile({ onSuccess: onSaved });

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: mapUserToFormValues(user),
    mode: "onChange",
  });

  useEffect(() => {
    form.reset(mapUserToFormValues(user));
  }, [user, form]);

  const onSubmit = form.handleSubmit(async (values) => {
    await mutateAsync(mapFormToPayload(values));
  });

  return {
    form,
    onSubmit,
    isSubmitting: isPending,
  };
}

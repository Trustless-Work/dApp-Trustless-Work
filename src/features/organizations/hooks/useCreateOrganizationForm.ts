"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createOrganizationSchema,
  type CreateOrganizationFormData,
} from "@/features/organizations/schemas/create-organization.schema";
import type { CreateOrganizationInput } from "@/features/organizations/types/organization.types";

type UseCreateOrganizationFormOptions = {
  onSubmit: (values: CreateOrganizationInput) => Promise<void>;
  isSubmitting: boolean;
};

export function useCreateOrganizationForm({
  onSubmit,
  isSubmitting,
}: UseCreateOrganizationFormOptions) {
  const form = useForm<CreateOrganizationFormData>({
    resolver: zodResolver(createOrganizationSchema),
    defaultValues: {
      name: "",
    },
    mode: "onChange",
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    await onSubmit({ name: values.name.trim() });
    form.reset();
  });

  return {
    form,
    onSubmit: handleSubmit,
    isSubmitting,
  };
}

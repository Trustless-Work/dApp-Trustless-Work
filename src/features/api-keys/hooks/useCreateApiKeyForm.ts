"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createApiKeySchema,
  type CreateApiKeyFormData,
} from "@/features/api-keys/schemas/create-api-key.schema";
import type { CreateApiKeyInput } from "@/features/api-keys/types/api-key.types";

type UseCreateApiKeyFormOptions = {
  platformId: string;
  onSubmit: (values: CreateApiKeyInput) => Promise<void>;
  isSubmitting: boolean;
};

export function useCreateApiKeyForm({
  platformId,
  onSubmit,
  isSubmitting,
}: UseCreateApiKeyFormOptions) {
  const form = useForm<CreateApiKeyFormData>({
    resolver: zodResolver(createApiKeySchema),
    defaultValues: {
      description: "",
    },
    mode: "onChange",
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    const description = values.description.trim();

    await onSubmit({
      platformId,
      ...(description ? { description } : {}),
    });
    form.reset({ description: "" });
  });

  return {
    form,
    onSubmit: handleSubmit,
    isSubmitting,
  };
}

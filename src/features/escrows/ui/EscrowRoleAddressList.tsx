"use client";

import { PlusIcon, Trash2Icon } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import { useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  CREATE_ESCROW_PLACEHOLDERS,
  MAX_ROLE_ADDRESS_COUNT,
  type MultiRoleFieldName,
} from "@/features/escrows/constants/create-escrow.constants";
import type { CreateEscrowFormData } from "@/features/escrows/schemas/create-escrow.schema";

type RoleArrayKey = MultiRoleFieldName extends `roles.${infer Key}` ? Key : never;

function isAddressFilled(value: string | undefined): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

function getRoleArrayKey(name: MultiRoleFieldName): RoleArrayKey {
  return name.replace("roles.", "") as RoleArrayKey;
}

function appendRoleAddress(
  form: UseFormReturn<CreateEscrowFormData>,
  name: MultiRoleFieldName,
): void {
  const roles = form.getValues("roles");
  const key = getRoleArrayKey(name);
  const current = roles[key];

  if (!Array.isArray(current) || current.length >= MAX_ROLE_ADDRESS_COUNT) {
    return;
  }

  const lastAddress = current[current.length - 1];
  if (!isAddressFilled(lastAddress)) {
    return;
  }

  form.setValue(
    "roles",
    {
      ...roles,
      [key]: [...current, ""],
    },
    {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: false,
    },
  );
}

function removeRoleAddress(
  form: UseFormReturn<CreateEscrowFormData>,
  name: MultiRoleFieldName,
  index: number,
): void {
  const roles = form.getValues("roles");
  const key = getRoleArrayKey(name);
  const current = roles[key];

  if (!Array.isArray(current) || current.length <= 1) {
    return;
  }

  form.setValue(
    "roles",
    {
      ...roles,
      [key]: current.filter((_, currentIndex) => currentIndex !== index),
    },
    {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: false,
    },
  );
}

type EscrowRoleAddressListProps = {
  form: UseFormReturn<CreateEscrowFormData>;
  name: MultiRoleFieldName;
  label: string;
  description: string;
  disabled?: boolean;
};

export const EscrowRoleAddressList = ({
  form,
  name,
  label,
  description,
  disabled = false,
}: EscrowRoleAddressListProps) => {
  const watchedAddresses = useWatch({
    control: form.control,
    name,
  });
  const addresses: string[] = Array.isArray(watchedAddresses)
    ? watchedAddresses
    : [];

  const lastAddress = addresses[addresses.length - 1];
  const canAppend =
    addresses.length < MAX_ROLE_ADDRESS_COUNT && isAddressFilled(lastAddress);

  return (
    <div className="rounded-xl border border-border p-3 md:p-4">
      <div className="mb-3 flex flex-col gap-1">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>

      <div className="flex flex-col gap-2">
        {addresses.map((_, index) => (
          <div key={`${name}-${index}`} className="flex items-start gap-2">
            <FormField
              control={form.control}
              name={`${name}.${index}`}
              render={({ field: addressField }) => (
                <FormItem className="flex-1">
                  <FormLabel className="sr-only">
                    {label} {index + 1}
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...addressField}
                      disabled={disabled}
                      placeholder={CREATE_ESCROW_PLACEHOLDERS.stellarAddress}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {addresses.length > 1 ? (
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                disabled={disabled}
                className="mt-0.5 shrink-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={() => removeRoleAddress(form, name, index)}
              >
                <Trash2Icon />
              </Button>
            ) : null}
          </div>
        ))}
      </div>

      {addresses.length < MAX_ROLE_ADDRESS_COUNT ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled || !canAppend}
          className="mt-3"
          onClick={() => appendRoleAddress(form, name)}
        >
          <PlusIcon />
          Add address
        </Button>
      ) : (
        <FormDescription className="mt-3">
          Maximum of {MAX_ROLE_ADDRESS_COUNT} addresses reached.
        </FormDescription>
      )}
    </div>
  );
};

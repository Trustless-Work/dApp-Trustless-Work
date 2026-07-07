"use client";

import type { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { trustlineOptions } from "@/components/tw-blocks/wallet-kit/trustlines";
import { CREATE_ESCROW_PLACEHOLDERS } from "@/features/escrows/constants/create-escrow.constants";
import type { CreateEscrowFormData } from "@/features/escrows/schemas/create-escrow.schema";

type EscrowTrustlineFieldProps = {
  form: UseFormReturn<CreateEscrowFormData>;
  disabled?: boolean;
};

export const EscrowTrustlineField = ({
  form,
  disabled = false,
}: EscrowTrustlineFieldProps) => {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      <FormField
        control={form.control}
        name="trustline.address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Asset issuer (G…)</FormLabel>
            <Select
              disabled={disabled}
              value={field.value}
              onValueChange={(value) => {
                const option = trustlineOptions.find(
                  (item) => item.value === value,
                );
                field.onChange(value);
                if (option) {
                  form.setValue("trustline.symbol", option.label, {
                    shouldValidate: true,
                  });
                }
              }}
            >
              <FormControl>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select asset" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {trustlineOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="trustline.symbol"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Symbol</FormLabel>
            <FormControl>
              <Input
                {...field}
                disabled={disabled}
                placeholder={CREATE_ESCROW_PLACEHOLDERS.trustlineSymbol}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

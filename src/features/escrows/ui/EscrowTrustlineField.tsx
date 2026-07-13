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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { trustlineOptions } from "@/components/tw-blocks/wallet-kit/trustlines";
import { CREATE_ESCROW_PLACEHOLDERS } from "@/features/escrows/constants/create-escrow.constants";
import type { CreateEscrowFormData } from "@/features/escrows/schemas/create-escrow.schema";

type EscrowTrustlineFieldProps = {
  form: UseFormReturn<CreateEscrowFormData>;
  disabled?: boolean;
};

function getDefaultPresetTrustline() {
  const option = trustlineOptions[0];

  return {
    address: option?.value ?? "",
    symbol: option?.label ?? "USDC",
  };
}

export const EscrowTrustlineCustomSwitch = ({
  form,
  disabled = false,
}: EscrowTrustlineFieldProps) => {
  const isCustom = form.watch("trustline.isCustom");

  const handleCustomToggle = (checked: boolean) => {
    form.setValue("trustline.isCustom", checked, { shouldValidate: true });

    if (checked) {
      form.setValue("trustline.address", "", { shouldValidate: true });
      form.setValue("trustline.symbol", "", { shouldValidate: true });
      return;
    }

    const preset = getDefaultPresetTrustline();
    form.setValue("trustline.address", preset.address, {
      shouldValidate: true,
    });
    form.setValue("trustline.symbol", preset.symbol, { shouldValidate: true });
  };

  return (
    <div className="flex items-center gap-2">
      <Switch
        id="trustline-custom"
        size="sm"
        checked={isCustom}
        onCheckedChange={handleCustomToggle}
        disabled={disabled}
        aria-label="Use custom trustline"
      />
      <Label
        htmlFor="trustline-custom"
        className="cursor-pointer text-sm font-normal text-muted-foreground"
      >
        Custom Trustline
      </Label>
    </div>
  );
};

export const EscrowTrustlineAddressField = ({
  form,
  disabled = false,
}: EscrowTrustlineFieldProps) => {
  const isCustom = form.watch("trustline.isCustom");

  return (
    <FormField
      control={form.control}
      name="trustline.address"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{isCustom ? "Trustline" : "Asset"}</FormLabel>
          {isCustom ? (
            <FormControl>
              <Input
                {...field}
                disabled={disabled}
                placeholder={CREATE_ESCROW_PLACEHOLDERS.trustlineCustomAddress}
              />
            </FormControl>
          ) : (
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
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export const EscrowTrustlineSymbolField = ({
  form,
  disabled = false,
}: EscrowTrustlineFieldProps) => {
  const isCustom = form.watch("trustline.isCustom");

  return (
    <FormField
      control={form.control}
      name="trustline.symbol"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Symbol</FormLabel>
          <FormControl>
            <Input
              {...field}
              disabled={disabled || !isCustom}
              placeholder={
                isCustom
                  ? CREATE_ESCROW_PLACEHOLDERS.trustlineSymbol
                  : undefined
              }
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export const EscrowTrustlineField = ({
  form,
  disabled = false,
}: EscrowTrustlineFieldProps) => {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium">Trustline</p>
        <EscrowTrustlineCustomSwitch form={form} disabled={disabled} />
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <EscrowTrustlineAddressField form={form} disabled={disabled} />
        <EscrowTrustlineSymbolField form={form} disabled={disabled} />
      </div>
    </div>
  );
};

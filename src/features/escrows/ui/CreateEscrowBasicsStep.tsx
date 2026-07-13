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
import { Textarea } from "@/components/ui/textarea";
import type { CreateEscrowFormData } from "@/features/escrows/schemas/create-escrow.schema";
import { CREATE_ESCROW_PLACEHOLDERS } from "@/features/escrows/constants/create-escrow.constants";
import {
  EscrowTrustlineAddressField,
  EscrowTrustlineCustomSwitch,
  EscrowTrustlineField,
  EscrowTrustlineSymbolField,
} from "@/features/escrows/ui/EscrowTrustlineField";
import { EscrowTypeTabs } from "@/features/escrows/ui/EscrowTypeTabs";
import type { EscrowType } from "@/features/escrows/types/escrow.types";

type CreateEscrowBasicsStepProps = {
  form: UseFormReturn<CreateEscrowFormData>;
  escrowType: EscrowType;
  onTypeChange: (type: EscrowType) => void;
  disabled?: boolean;
  walletConnected: boolean;
};

export const CreateEscrowBasicsStep = ({
  form,
  escrowType,
  onTypeChange,
  disabled = false,
  walletConnected,
}: CreateEscrowBasicsStepProps) => {
  return (
    <div className="flex flex-col gap-5">
      <EscrowTypeTabs
        value={escrowType}
        onValueChange={onTypeChange}
        disabled={disabled}
      />

      {!walletConnected ? (
        <p className="rounded-lg border border-dashed border-border px-3 py-2 text-sm text-muted-foreground">
          Connect your wallet to prefill addresses and deploy on-chain.
        </p>
      ) : null}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormField
          control={form.control}
          name="engagementId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Engagement ID</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled={disabled}
                  placeholder={CREATE_ESCROW_PLACEHOLDERS.engagementId}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled={disabled}
                  placeholder={CREATE_ESCROW_PLACEHOLDERS.title}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  disabled={disabled}
                  rows={3}
                  placeholder={CREATE_ESCROW_PLACEHOLDERS.description}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {escrowType === "single-release" ? (
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total amount</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    min={0}
                    step="any"
                    disabled={disabled}
                    placeholder={CREATE_ESCROW_PLACEHOLDERS.amount}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : null}

        {escrowType === "single-release" ? (
          <FormField
            control={form.control}
            name="platformFee"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Platform Fee (%)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    min={0}
                    max={100}
                    step="any"
                    disabled={disabled}
                    placeholder={CREATE_ESCROW_PLACEHOLDERS.platformFee}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : null}
      </div>

      {escrowType === "multi-release" ? (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium">Fees & asset</p>
            <EscrowTrustlineCustomSwitch form={form} disabled={disabled} />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <FormField
              control={form.control}
              name="platformFee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Platform Fee (%)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      min={0}
                      max={100}
                      step="any"
                      disabled={disabled}
                      placeholder={CREATE_ESCROW_PLACEHOLDERS.platformFee}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <EscrowTrustlineAddressField form={form} disabled={disabled} />
            <EscrowTrustlineSymbolField form={form} disabled={disabled} />
          </div>
        </div>
      ) : (
        <EscrowTrustlineField form={form} disabled={disabled} />
      )}
    </div>
  );
};

"use client";

import { PlusIcon, Trash2Icon } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import { useFieldArray, useWatch } from "react-hook-form";
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
import { Textarea } from "@/components/ui/textarea";
import { CREATE_ESCROW_PLACEHOLDERS } from "@/features/escrows/constants/create-escrow.constants";
import { getApprovalsTargetHint } from "@/features/escrows/utils/create-escrow.helper";
import type {
  CreateEscrowFormData,
  MultiReleaseCreateFormData,
} from "@/features/escrows/schemas/create-escrow.schema";
import type { EscrowType } from "@/features/escrows/types/escrow.types";

type MilestoneFieldBaseProps = {
  form: UseFormReturn<CreateEscrowFormData>;
  index: number;
  disabled?: boolean;
  className?: string;
};

type MilestoneFieldsProps = MilestoneFieldBaseProps & {
  approversCount: number;
};

const MilestoneDescriptionField = ({
  form,
  index,
  disabled = false,
  className,
}: MilestoneFieldBaseProps) => (
  <FormField
    control={form.control}
    name={`milestones.${index}.description`}
    render={({ field }) => (
      <FormItem className={className}>
        <FormLabel>Description</FormLabel>
        <FormControl>
          <Textarea
            {...field}
            disabled={disabled}
            rows={2}
            placeholder={CREATE_ESCROW_PLACEHOLDERS.milestoneDescription}
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

const SingleReleaseMilestoneFields = ({
  form,
  index,
  approversCount,
  disabled = false,
}: MilestoneFieldsProps) => (
  <div className="flex flex-col gap-3">
    <MilestoneDescriptionField form={form} index={index} disabled={disabled} />

    <FormField
      control={form.control}
      name={`milestones.${index}.approvalsTarget`}
      render={({ field }) => (
        <FormItem>
          <div className="flex items-center justify-between gap-4 rounded-lg border border-border/60 bg-muted/20 px-3 py-2.5">
            <div className="min-w-0 space-y-0.5">
              <FormLabel className="text-sm font-medium">
                Approvals Required
              </FormLabel>
              <FormDescription className="text-xs">
                {getApprovalsTargetHint(approversCount)}
              </FormDescription>
            </div>
            <FormControl>
              <Input
                {...field}
                type="number"
                min={1}
                max={Math.max(approversCount, 1)}
                disabled={disabled}
                placeholder={CREATE_ESCROW_PLACEHOLDERS.approvalsTarget}
                className="h-9 w-16 shrink-0 text-center tabular-nums"
              />
            </FormControl>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  </div>
);

const MultiReleaseMilestoneFields = ({
  form,
  index,
  approversCount,
  disabled = false,
}: MilestoneFieldsProps) => (
  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
    <MilestoneDescriptionField
      form={form}
      index={index}
      disabled={disabled}
      className="md:col-span-2"
    />

    <FormField
      control={form.control}
      name={`milestones.${index}.amount`}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Amount</FormLabel>
          <FormControl>
            <Input
              {...field}
              type="number"
              min={0}
              step="any"
              disabled={disabled}
              placeholder={CREATE_ESCROW_PLACEHOLDERS.milestoneAmount}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />

    <FormField
      control={form.control}
      name={`milestones.${index}.approvalsTarget`}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Approvals Required</FormLabel>
          <FormControl>
            <Input
              {...field}
              type="number"
              min={1}
              max={Math.max(approversCount, 1)}
              disabled={disabled}
              placeholder={CREATE_ESCROW_PLACEHOLDERS.approvalsTarget}
            />
          </FormControl>
          <FormDescription>
            {getApprovalsTargetHint(approversCount)}
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />

    <FormField
      control={form.control}
      name={`milestones.${index}.receiver`}
      render={({ field }) => (
        <FormItem className="md:col-span-2">
          <FormLabel>Receiver</FormLabel>
          <FormControl>
            <Input
              {...field}
              disabled={disabled}
              placeholder={CREATE_ESCROW_PLACEHOLDERS.stellarAddress}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  </div>
);

type MilestonesFieldArrayProps = {
  form: UseFormReturn<CreateEscrowFormData>;
  escrowType: EscrowType;
  disabled?: boolean;
};

export const MilestonesFieldArray = ({
  form,
  escrowType,
  disabled = false,
}: MilestonesFieldArrayProps) => {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "milestones",
  });

  const approvers = useWatch({
    control: form.control,
    name: "roles.approvers",
  });
  const approversCount = approvers?.length ?? 0;

  const handleAdd = () => {
    const defaultReceiver =
      form.getValues("roles.approvers")?.[0] ??
      form.getValues("roles.serviceProviders")?.[0] ??
      "";

    if (escrowType === "multi-release") {
      const milestone: MultiReleaseCreateFormData["milestones"][number] = {
        description: "",
        approvalsTarget: 1,
        amount: 0,
        receiver: defaultReceiver,
      };
      append(milestone as CreateEscrowFormData["milestones"][number]);
      return;
    }

    append({
      description: "",
      approvalsTarget: 1,
    });
  };

  return (
    <div className="flex flex-col gap-3">
      {fields.length === 0 ? (
        <div className="rounded-lg border border-border bg-muted/30 px-4 py-6 text-center">
          <p className="text-sm font-medium">No milestones</p>
          <p className="mt-1 text-sm text-muted-foreground">
            You can deploy this escrow without milestones and add them later.
          </p>
        </div>
      ) : null}

      {fields.map((field, index) => (
        <div
          key={field.id}
          className="rounded-lg border border-border p-3 md:p-4"
        >
          <div className="mb-3 flex items-center justify-between gap-2">
            <p className="text-sm font-medium">Milestone {index + 1}</p>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              disabled={disabled}
              aria-label={`Remove milestone ${index + 1}`}
              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={() => remove(index)}
            >
              <Trash2Icon className="size-4" aria-hidden="true" />
            </Button>
          </div>

          {escrowType === "single-release" ? (
            <SingleReleaseMilestoneFields
              form={form}
              index={index}
              approversCount={approversCount}
              disabled={disabled}
            />
          ) : (
            <MultiReleaseMilestoneFields
              form={form}
              index={index}
              approversCount={approversCount}
              disabled={disabled}
            />
          )}
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={disabled}
        onClick={handleAdd}
        className="self-start"
      >
        <PlusIcon className="size-4" aria-hidden="true" />
        Add milestone
      </Button>
    </div>
  );
};
